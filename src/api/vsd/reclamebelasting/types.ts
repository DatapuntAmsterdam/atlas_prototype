/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference } from '../../types'

export interface Root extends APIReference {
  ogc_fid: number
  wkb_geometry: Geometry
  tarief: string
  website: string
  tarieven: string
}
