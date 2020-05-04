import { getByUrl } from '../../../shared/services/api/api'
import {
  fetchByPandId as fetchAddressByPandId,
  fetchHoofdadresByLigplaatsId,
  fetchHoofdadresByStandplaatsId,
} from '../adressen-nummeraanduiding/adressen-nummeraanduiding'
import { createMapSearchResultsModel } from '../map-search-results/map-search-results'
import { fetchByPandId as fetchMonumentByPandId } from '../monument/monument'
import { fetchByAddressId, fetchByPandId as fetchVestigingByPandId } from '../vestiging/vestiging'
import transformResultByType from './transform-result-by-type'

const endpoints = [
  { uri: 'geosearch/nap/', radius: 25 },
  { uri: 'geosearch/bag/' },
  { uri: 'geosearch/munitie/' },
  { uri: 'geosearch/bominslag/', radius: 25 },
  {
    uri: 'geosearch/monumenten/',
    radius: 25,
    extra_params: {
      monumenttype: 'isnot_pand_bouwblok',
    },
  },
  { uri: 'geosearch/biz/' },
  { uri: 'geosearch/winkgeb/' },
  { uri: 'parkeervakken/geosearch/' },
  { uri: 'geosearch/oplaadpunten/', radius: 25 },
  { uri: 'geosearch/bekendmakingen/', radius: 25 },
  { uri: 'geosearch/evenementen/', radius: 25 },
  { uri: 'geosearch/reclamebelasting/', radius: 25 },
  { uri: 'geosearch/', radius: 25, extra_params: { datasets: 'fietspaaltjes' } },
]

const relatedResourcesByType = {
  'bag/ligplaats': [
    {
      fetch: (ligplaatsId) =>
        fetchHoofdadresByLigplaatsId(ligplaatsId).then((result) => fetchByAddressId(result.id)),
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
      fetch: (standplaatsId) =>
        fetchHoofdadresByStandplaatsId(standplaatsId).then((result) => fetchByAddressId(result.id)),
      type: 'vestiging',
      authScope: 'HR/R',
    },
  ],
}

export const geosearchTypes = {
  parkeervakken: 'parkeervakken/geosearch/',
}

// this handles the geosearch endpoints that are not included in the geosearch api
// and don't implement the geosearch api interface
export const getFeaturesFromResult = (endpointType, result) => {
  if (endpointType === geosearchTypes.parkeervakken) {
    return result.map((item) => ({
      properties: {
        display: item.id,
        type: 'parkeervakken/parkeervakken',
        uri: process.env.API_ROOT + item._links.self.href.substring(1),
      },
    }))
  }

  return result.features
}

export const fetchRelatedForUser = (user) => (data) => {
  const item = data.features.find((feature) => relatedResourcesByType[feature.properties.type])
  if (!item) {
    return data.features
  }

  const resources = relatedResourcesByType[item.properties.type]
  const requests = resources.map((resource) =>
    resource.authScope && (!user.authenticated || !user.scopes.includes(resource.authScope))
      ? []
      : resource.fetch(item.properties.id).then((results) =>
          results.map((result) => ({
            ...result,
            properties: {
              uri: result._links.self.href,
              display: result._display,
              type: resource.type,
              parent: item.properties.type,
            },
          })),
        ),
  )

  return Promise.all(requests).then((results) =>
    results.reduce((accumulator, subResults) => accumulator.concat(subResults), data.features),
  )
}

export default function search(location, user) {
  const errorType = 'error'
  const allRequests = []

  endpoints.forEach((endpoint) => {
    const isInScope = endpoint.authScope && user.scopes && user.scopes.includes(endpoint.authScope)

    if (!endpoint.authScope || isInScope) {
      const searchParams = {
        ...endpoint.extra_params,
        lat: location.latitude,
        lon: location.longitude,
        radius: endpoint.radius || 0,
      }

      const queryString = Object.keys(searchParams)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(searchParams[key])}`)
        .join('&')

      const request = getByUrl(`${process.env.API_ROOT}${endpoint.uri}?${queryString}`)
        .then((result) => ({
          features: getFeaturesFromResult(endpoint.uri, result),
        }))
        .then(fetchRelatedForUser(user))
        .then(
          (features) => features.map((feature) => transformResultByType(feature)),
          (code) => ({
            type: errorType,
            code,
          }),
        )
      allRequests.push(request)
    }
  })

  const allResults = Promise.all(
    allRequests.map((p) =>
      p.then((result) => Promise.resolve(result)).catch(() => Promise.resolve([])),
    ),
  ) // ignore the failing calls
  return allResults
    .then((results) => [].concat.apply([], [...results]))
    .then((results) => ({
      results: createMapSearchResultsModel(
        results.filter((result) => result && result.type !== errorType),
      ),
      errors: results.some((result) => result && result.type === errorType),
    }))
}
