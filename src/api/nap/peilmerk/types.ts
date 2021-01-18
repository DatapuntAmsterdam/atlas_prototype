/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference, Links } from '../../types'

export interface Single extends APIReference {
  peilmerkidentificatie: string
  hoogte_nap: string
  jaar: number
  merk: string
  omschrijving: string
  windrichting: string
  x_muurvlak: string
  y_muurvlak: string
  rws_nummer: string
  geometrie: Geometry
}

export interface List {
  _links: Links
  count: number
  results: Array<
    Pick<APIReference, '_links' | '_display' | 'dataset'> & {
      id: string
    }
  >
}
