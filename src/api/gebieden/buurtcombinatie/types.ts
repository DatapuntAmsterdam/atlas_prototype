/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { Links, APIReference, SmallAPIReference } from '../../types'

export interface Single {
  _links: Links
  _display: string
  buurtcombinatie_identificatie: string
  naam: string
  code: string
  volledige_code: string
  brondocument_naam: string
  brondocument_datum: any
  geometrie: Geometry
  begin_geldigheid: string
  einde_geldigheid: any
  stadsdeel: APIReference
  buurten: SmallAPIReference
  bbox: number[]
  _gemeente: APIReference
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Array<
    Pick<APIReference, '_links' | '_display' | 'naam' | 'dataset'> & {
      vollcode: string
    }
  >
}
