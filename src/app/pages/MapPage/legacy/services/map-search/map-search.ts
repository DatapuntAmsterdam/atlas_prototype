// eslint-disable-next-line import/no-extraneous-dependencies
import type { FeatureCollection, Geometry } from 'geojson'
import type { LatLngLiteral } from 'leaflet'
import environment from '../../../../../../environment'
import { fetchWithToken } from '../../../../../../shared/services/api/api'
import { getScopes, isAuthenticated } from '../../../../../../shared/services/auth/auth'
import {
  fetchByPandId as fetchAddressByPandId,
  fetchHoofdadresByLigplaatsId,
  fetchHoofdadresByStandplaatsId,
} from '../adressen-nummeraanduiding/adressen-nummeraanduiding'
import { createMapSearchResultsModel } from '../map-search-results/map-search-results'
import { fetchByPandId as fetchMonumentByPandId } from '../monument/monument'
import { fetchByAddressId, fetchByPandId as fetchVestigingByPandId } from '../vestiging/vestiging'
import transformResultByType from './transform-result-by-type'
import type { GeoSearchFeature } from '../../../../../../api/geosearch'

interface Endpoint {
  uri: string
  radius?: number
  authScope?: string
  params?: { [key: string]: string }
}

const endpoints: Endpoint[] = [
  { uri: 'geosearch/nap/', radius: 25 },
  { uri: 'geosearch/bag/' },
  { uri: 'geosearch/munitie/' },
  { uri: 'geosearch/bominslag/', radius: 25 },
  {
    uri: 'geosearch/monumenten/',
    radius: 25,
    params: {
      monumenttype: 'isnot_pand_bouwblok',
    },
  },
  { uri: 'geosearch/biz/' },
  { uri: 'geosearch/winkgeb/' },
  { uri: 'geosearch/', params: { datasets: 'parkeervakken' } },
  { uri: 'geosearch/oplaadpunten/', radius: 25 },
  { uri: 'geosearch/bekendmakingen/', radius: 25 },
  { uri: 'geosearch/evenementen/', radius: 25 },
  { uri: 'geosearch/reclamebelasting/', radius: 25 },
  { uri: 'geosearch/', radius: 25, params: { datasets: 'fietspaaltjes' } },
  { uri: 'geosearch/', radius: 25, params: { datasets: 'grex,projecten' } },
  { uri: 'geosearch/', radius: 25, params: { datasets: 'bouwstroompunten' } },
]

interface RelatedResource {
  type: string
  authScope?: string
  // TODO: Provide a better return type here.
  fetch: (id: string) => Promise<any[]>
}

const relatedResourcesByType: { [key: string]: RelatedResource[] } = {
  'bag/ligplaats': [
    {
      fetch: (ligplaatsId: string) =>
        fetchHoofdadresByLigplaatsId(ligplaatsId).then((result) =>
          fetchByAddressId(result?.id as string),
        ),
      type: 'vestiging',
      authScope: 'HR/R',
    },
  ],
  'bag/pand': [
    {
      fetch: fetchAddressByPandId,
      type: 'pand/address',
    },
    {
      fetch: fetchVestigingByPandId,
      type: 'vestiging',
      authScope: 'HR/R',
    },
    {
      fetch: fetchMonumentByPandId,
      type: 'pand/monument',
    },
  ],
  'bag/standplaats': [
    {
      fetch: (standplaatsId: string) =>
        fetchHoofdadresByStandplaatsId(standplaatsId).then((result) =>
          fetchByAddressId(result?.id as string),
        ),
      type: 'vestiging',
      authScope: 'HR/R',
    },
  ],
}

export interface MapFeatureProperties {
  id: string
  type: string
}

export const fetchRelatedForUser =
  () => (data: FeatureCollection<Geometry, MapFeatureProperties>) => {
    const relatableFeature = data.features.find(
      (feature) => relatedResourcesByType[feature.properties.type],
    )

    if (!relatableFeature) {
      return data.features
    }

    const resources = relatedResourcesByType[relatableFeature.properties.type]
    const requests = resources.map((resource) =>
      resource.authScope && (!isAuthenticated() || !getScopes().includes(resource.authScope))
        ? []
        : resource.fetch(relatableFeature.properties.id).then((results) =>
            results.map((result) => ({
              ...result,
              properties: {
                // eslint-disable-next-line no-underscore-dangle
                uri: result._links.self.href,
                // eslint-disable-next-line no-underscore-dangle
                display: result._display,
                type: resource.type,
                parent: relatableFeature.properties.type,
              },
            })),
          ),
    )

    return Promise.all(requests).then((results) =>
      results.reduce((accumulator, subResults) => accumulator.concat(subResults), data.features),
    )
  }

export interface MapSearchResponse {
  errors: boolean
  location: LatLngLiteral
  results: MapSearchCategory[]
}

export interface MapSearchCategory {
  type: string
  categoryLabel: string
  categoryLabelPlural: string
  subCategories: MapSearchCategory[]
  results: MapSearchResult[]
  parent?: string
}

export interface MapSearchResult {
  type: string
  uri?: string
  categoryLabel: string
  categoryLabelPlural: string
  label: string
  statusLabel: string
}

export default function mapSearch(location: LatLngLiteral | null): Promise<MapSearchResponse> {
  const errorType = 'error'
  const allRequests: Promise<any>[] = []

  if (!location) {
    return Promise.reject(Error('No location given'))
  }

  endpoints.forEach((endpoint) => {
    const isInScope = !endpoint.authScope || getScopes().includes(endpoint.authScope)

    if (!isInScope) {
      return
    }

    const searchParams = new URLSearchParams({
      ...endpoint.params,
      lat: location.lat.toString(),
      lon: location.lng.toString(),
      radius: (endpoint.radius ?? 0).toString(),
    })

    const request = fetchWithToken<FeatureCollection<Geometry, MapFeatureProperties>>(
      `${environment.API_ROOT}${endpoint.uri}?${searchParams.toString()}`,
    )
      .then(fetchRelatedForUser())
      .then(
        (features) => features.map((feature: GeoSearchFeature) => transformResultByType(feature)),
        (code) => ({
          type: errorType,
          code,
        }),
      )

    allRequests.push(request)
  })

  // ignore the failing calls
  const allResults = Promise.all(
    allRequests.map((p) =>
      p.then((result) => Promise.resolve(result)).catch(() => Promise.resolve([])),
    ),
  )

  // TODO: Improve typing of this method
  return allResults
    .then((results) => [].concat.apply([], [...results]))
    .then((results: any[]) => ({
      results: createMapSearchResultsModel(
        results.filter((result) => result && result.type !== errorType),
      ),
      location,
      errors: results.some((result) => result && result.type === errorType),
    }))
}
