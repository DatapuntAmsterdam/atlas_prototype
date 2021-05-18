/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference } from '../../types'

export interface Root extends APIReference {
  id: number
  kenmerk: string
  type: string
  opdrachtnemer: string
  verdacht_gebied: string
  onderzoeksgebied: string
  opdrachtgever: string
  datum: string
  geometrie: Geometry
}
