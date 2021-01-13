/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { SmallAPIReference, Links, APIReference } from '../../types'

export interface Single {
  _links: Links
  _display: string
  bouwblokidentificatie: string
  code: string
  buurt: APIReference
  begin_geldigheid: string
  einde_geldigheid: any
  bbox: number[]
  geometrie: Geometry
  panden: SmallAPIReference
  meetbouten: string
  _buurtcombinatie: APIReference
  _stadsdeel: APIReference
  _gemeente: APIReference
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'landelijk_id' | 'dataset'>[]
}
