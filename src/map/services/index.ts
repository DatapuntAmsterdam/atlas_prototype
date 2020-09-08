import environment from '../../environment'

const mapBaseLayers = require('../../../public/static/map/map-base-layers.config.json')

// TODO: Generate these types from the GraphQL schema.
export interface MapLayer {
  __typename: 'MapLayer'
  id: string
  title: string
  type: MapLayerType
  noDetail: boolean
  minZoom: number
  layers?: string[]
  url?: string
  params?: string
  detailUrl?: string
  detailParams?: DetailParams
  detailIsShape?: boolean
  iconUrl?: string
  imageRule?: string
  notSelectable: boolean
  external?: boolean
  bounds: [number[]]
  authScope?: string
  category?: string
  legendItems?: MapLayerLegendItem[]
  meta: Meta
  href: string
}

export interface LegendItem {
  __typename: 'LegendItem'
  title: string
  iconUrl?: string
  imageRule?: string
  notSelectable: boolean
}

export type MapLayerLegendItem = MapLayer | LegendItem

export type MapLayerType = 'wms' | 'tms'

export interface DetailParams {
  item: string
  datasets: string
}

export interface Meta {
  description?: string
  themes: Theme[]
  datasetIds?: number[]
  thumbnail?: string
  date?: string
}

export interface Theme {
  id: string
  title: string
}

export interface MapCollection {
  id: string
  title: string
  mapLayers: MapLayer[]
}

interface FetchMapResult<T> {
  results: T[]
}

async function fetchMap<T>(resolver: string, query: string): Promise<FetchMapResult<T>> {
  const result = await fetch(environment.GRAPHQL_ENDPOINT, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
    }),
  })

  const json = await result.json()

  return json.data[resolver]
}

export interface MapBaseLayer {
  value: string
  category: string
  label: string
  urlTemplate: string
}

export function getMapBaseLayers(): MapBaseLayer[] {
  return mapBaseLayers
}

export async function getMapLayers() {
  const query = `{
    mapLayerSearch(input: { limit: 9999 }) {
      results {
        id
        title
        legendItems {
          ... on MapLayer {
            __typename
            id
          }
        }
        url
        params
        layers
        external
        detailUrl
        detailParams {
          item
          datasets
        }
        detailIsShape
        noDetail
        authScope
        type
      }
    }
  }`

  return (await fetchMap<MapLayer>('mapLayerSearch', query)).results
}

export async function getPanelLayers() {
  const query = `{
    mapCollectionSearch(input: { limit: 9999 }) {
      results {
        id
        title
        mapLayers {
          id
          title
          legendItems {
            ... on MapLayer {
              id
              title
              url
              params
              layers
              iconUrl
              imageRule
              notSelectable
              noDetail
            }
            ... on LegendItem {
              title
              iconUrl
              imageRule
              notSelectable
            }
          }
          authScope
          imageRule
          iconUrl
          url
          params
          layers
          detailUrl
          detailParams {
            item
            datasets
          }
          detailIsShape
          type
          noDetail
          minZoom
        }
      }
    }
  }`

  return (await fetchMap<MapCollection>('mapCollectionSearch', query)).results
}
