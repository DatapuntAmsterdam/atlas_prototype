/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  peilmerkidentificatie: string
  hoogte_nap: string
  jaar: number
  merk: string
  omschrijving: string
  windrichting: string
  x_muurvlak: string
  y_muurvlak: string
  rws_nummer: string
  geometrie: Geometry
}
