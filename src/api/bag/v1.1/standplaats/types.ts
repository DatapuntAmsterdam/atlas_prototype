/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference, Links, SmallAPIReference } from '../../../types'

export interface Single extends APIReference {
  standplaatsidentificatie: string
  landelijk_id: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  begin_geldigheid: string
  einde_geldigheid: any
  bron: any
  indicatie_geconstateerd: boolean
  aanduiding_in_onderzoek: boolean
  bbox: number[]
  geometrie: Geometry
  hoofdadres: APIReference
  adressen: SmallAPIReference
  buurt: APIReference
  _buurtcombinatie: APIReference
  _stadsdeel: APIReference
  _gebiedsgerichtwerken: APIReference
  _grootstedelijkgebied: any
  _gemeente: APIReference
  _woonplaats: APIReference
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'landelijk_id' | 'dataset'>[]
}
