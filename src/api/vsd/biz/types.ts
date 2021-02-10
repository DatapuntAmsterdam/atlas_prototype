/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  id: number
  naam: string
  biz_type: string
  heffingsgrondslag: string
  website: string
  heffing: any
  heffing_valuta_code: string
  heffing_display: any
  bijdrageplichtigen: number
  verordening: string
  geometrie: Geometry
}
