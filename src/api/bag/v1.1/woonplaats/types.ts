/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference, SmallAPIReference } from '../../../types'

export interface Root extends APIReference {
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
