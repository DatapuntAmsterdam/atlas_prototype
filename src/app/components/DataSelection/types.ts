import { ObjectDetail } from '../../../api/dataselectie/bag/types'
import { Links } from '../../../api/types'

export enum DatasetType {
  Bag = 'bag',
  Brk = 'brk',
  Hr = 'hr',
}

export enum LegacyDataSelectionViewTypes {
  List = 'LIST',
  Table = 'TABLE',
}

export type FilterObject = {
  [key: string]: string
}

export type ActiveFilter = {
  key: string
  value: string
  label: string
}
export type AvailableFilterOption = {
  count: number
  id: string
  label: string
}

export type AvailableFilter = {
  label: string
  numberOfOptions: number
  slug: string
  options: AvailableFilterOption[]
  // eslint-disable-next-line camelcase
  info_url?: string
}

export type BoundingBox = {
  southWest: [number, number]
  northEast: [number, number]
}

export type Data = {
  head: Array<null | string>
  body: {
    id: string
    detailEndpoint: string | null
    content: { id: string; value: string; key: string }[][]
  }[]
  formatters: Array<null | string>
  templates: Array<null | string>
}
export type ObjectDetailWithLink = ObjectDetail & { _links: Links }
