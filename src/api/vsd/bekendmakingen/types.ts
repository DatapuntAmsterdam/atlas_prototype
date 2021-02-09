/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { APIReference } from '../../types'

export interface Root extends APIReference {
  ogc_fid: number
  wkb_geometry: Geometry
  id: string
  oid_: number
  categorie: string
  onderwerp: string
  titel: string
  beschrijving: string
  url: string
  postcodehuisnummer: string
  plaats: string
  straat: string
  datum: string
  overheid: string
}
