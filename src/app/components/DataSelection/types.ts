import type { LatLngTuple } from 'leaflet'
import type { ObjectDetail } from '../../../api/dataselectie/bag/types'
import type { Links } from '../../../api/types'
import type { FormatterType, TemplateType } from './DataSelectionFormatter/DataSelectionFormatter'

export enum DatasetType {
  Bag = 'bag',
  Brk = 'brk',
  Hr = 'hr',
}

export enum LegacyDataSelectionViewTypes {
  List = 'LIST',
  Table = 'TABLE',
}

export interface FilterObject {
  [key: string]: string
}

export interface ActiveFilter {
  key: string
  value: string
  label: string
}

export interface AvailableFilterOption {
  count: number
  id: string
  label: string
}

export interface AvailableFilter {
  label: string
  numberOfOptions: number
  slug: string
  options: AvailableFilterOption[]
  // eslint-disable-next-line camelcase
  info_url?: string
}

export interface BoundingBox {
  southWest: LatLngTuple
  northEast: LatLngTuple
}

export interface Data {
  head: (null | string)[]
  body: DataBody[]
  formatters: (FormatterType | null)[]
  templates: (TemplateType | null)[]
}

export interface DataBody {
  id: string
  detailEndpoint: string | null
  content: DataBodyContent[][]
}

export interface DataBodyContent {
  id: string
  value: string
  key: string
}

export interface ObjectDetailWithLink extends ObjectDetail {
  _links: Links
}
