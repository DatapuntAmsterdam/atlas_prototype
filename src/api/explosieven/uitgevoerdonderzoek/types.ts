/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

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
