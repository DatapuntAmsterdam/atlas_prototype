/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  schema: string
  id: number
  geometry: Geometry
  plannaam: string
  planstatus: string
  startdatum: string
  oppervlakte: number
}
