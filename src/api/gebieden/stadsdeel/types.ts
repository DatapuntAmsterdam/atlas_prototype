import { Geometry } from 'geojson'
import { SmallAPIReference, Links, APIReference } from '../../types'

export interface Gemeente {
  _display: string
  _links: Links
  naam: string
  code: string
  dataset: string
}

export interface Single {
  _links: Links
  _display: string
  stadsdeelidentificatie: string
  code: string
  /* eslint-disable camelcase */
  date_modified: string
  begin_geldigheid: string
  einde_geldigheid?: any
  brondocument_naam: string
  brondocument_datum: string
  /* eslint-enable camelcase */
  naam: string
  gemeente: Gemeente
  bbox: number[]
  geometrie: Geometry
  buurten: SmallAPIReference
  buurtcombinaties: SmallAPIReference
  gebiedsgerichtwerken: SmallAPIReference
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'code' | 'naam' | 'dataset'>[]
}
