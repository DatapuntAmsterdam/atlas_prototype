/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { SmallAPIReference, APIReference, Links } from '../../../types'

export interface Single {
  _links: Links
  _display: string
  openbare_ruimte_identificatie: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  begin_geldigheid: string
  einde_geldigheid: any
  status: string
  bron: any
  geometrie: Geometry
  type: string
  naam: string
  omschrijving: string
  naam_24_posities: string
  woonplaats: APIReference
  adressen: SmallAPIReference
  bbox: number[]
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'landelijk_id' | 'dataset'>[]
}
