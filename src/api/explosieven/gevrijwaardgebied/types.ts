/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference } from '../../types'

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
