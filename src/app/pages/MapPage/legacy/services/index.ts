import type { LegendItem as MapLegendItem, MapGroup } from '../../../../../api/cms_search/graphql'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mapBaseLayers = require('../../../../../../public/static/map/map-base-layers.config.json')

export interface Theme {
  id: string
  title: string
}

export interface ExtendedMapGroup extends MapGroup {
  isVisible: boolean
  isEmbedded: boolean
}
export interface ExtendedMapGroupLegendItem extends MapLegendItem {
  isVisible: boolean
  isEmbedded: boolean
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
