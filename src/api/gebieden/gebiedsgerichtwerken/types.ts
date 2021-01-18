/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { SmallAPIReference, Links, APIReference } from '../../types'

export interface Single {
  _links: Links
  _display: string
  naam: string
  code: string
  stadsdeel: APIReference
  buurten: SmallAPIReference
  bbox: number[]
  geometrie: Geometry
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'naam' | 'code' | 'dataset'>[]
}
