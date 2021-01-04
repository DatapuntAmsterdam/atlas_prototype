/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  id: number
  bron: string
  kenmerk: string
  type: string
  datum: string
  opmerkingen: string
  nauwkeurig: string
  intekening: string
  geometrie: Geometry
}
