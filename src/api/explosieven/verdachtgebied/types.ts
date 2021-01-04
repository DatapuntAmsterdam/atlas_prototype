/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  id: number
  bron: any
  kenmerk: string
  type: string
  afbakening: string
  aantal: string
  cartografie: string
  horizontaal: string
  kaliber: string
  subtype: string
  oorlogshandeling: string
  verschijning: string
  pdf: string
  opmerkingen: string
  geometrie: Geometry
}
