/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { Links, APIReference } from '../../types'

export interface Single {
  _links: Links
  _display: string
  naam: string
  gsg_type: string
  bbox: number[]
  geometrie: Geometry
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Array<
    Pick<APIReference, '_links' | '_display' | 'naam' | 'dataset'> & {
      gsg_type: string
    }
  >
}
