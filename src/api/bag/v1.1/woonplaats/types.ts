/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { APIReference, Links, SmallAPIReference } from '../../../types'

export interface Single extends APIReference {
  woonplaatsidentificatie: string
  date_modified: string
  document_mutatie: string
  document_nummer: string
  begin_geldigheid: string
  einde_geldigheid: any
  naam: string
  gemeente: APIReference
  geometrie: Geometry
  openbare_ruimtes: SmallAPIReference
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'landelijk_id' | 'dataset'>[]
}
