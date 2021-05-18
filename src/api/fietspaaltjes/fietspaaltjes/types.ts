/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference } from '../../types'

export interface Root extends APIReference {
  schema: string
  at: string
  id: string
  area: string
  type: string[]
  count: number
  ruimte: string[]
  street: string
  geometry: Geometry
  noodzaak: string[]
  soortWeg: string[]
  markering: string[]
  uiterlijk: string[]
  score2013: any
  veiligheid: string[]
  paaltjesWeg: string[]
  soortPaaltje: string[]
  scoreCurrent: string
  zichtInDonker: string[]
  beschadigingen: string[]
}
