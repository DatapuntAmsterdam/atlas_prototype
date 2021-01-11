/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference } from '../../../types'

export interface Root extends APIReference {
  nummeraanduidingidentificatie: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  begin_geldigheid: string
  einde_geldigheid: any
  status: string
  bron: any
  adres: string
  postcode: string
  huisnummer: number
  huisletter: string
  huisnummer_toevoeging: string
  type: string
  openbare_ruimte: APIReference
  type_adres: string
  ligplaats: any
  standplaats: any
  verblijfsobject: string
  buurt: APIReference
  buurtcombinatie: APIReference
  gebiedsgerichtwerken: APIReference
  grootstedelijkgebied: any
  stadsdeel: APIReference
  woonplaats: APIReference
  bouwblok: APIReference
  _geometrie: Geometry
}
