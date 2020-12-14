/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  id: number
  bron: string
  oorlogsinc: string
  kenmerk: string
  type: string
  opmerkingen: string
  nauwkeurig: string
  datum: any
  datum_inslag: string
  pdf: string
  intekening: string
  geometrie: Geometry
}
