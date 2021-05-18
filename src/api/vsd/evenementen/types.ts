/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { APIReference } from '../../types'

export interface Root extends APIReference {
  id: string
  geometry: Geometry
  titel: string
  url: string
  omschrijving: string
  startdatum: string
  starttijd: string
  einddatum: any
  eindtijd: string
}
