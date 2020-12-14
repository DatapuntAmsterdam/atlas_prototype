/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

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
