/* eslint-disable camelcase */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { APIReference, Links, SmallAPIReference } from '../../types'

export interface Single extends APIReference {
  id: string
  aanduiding: string
  kadastrale_gemeente: APIReference
  sectie: Sectie
  gemeente?: APIReference
  objectnummer: string
  indexletter: string
  indexnummer: number
  soort_grootte: SoortGrootte
  grootte: string
  meer_objecten: any
  register9_tekst: string
  status_code: string
  toestandsdatum: string
  voorlopige_kadastrale_grens: boolean
  in_onderzoek: string
  geometrie: Geometry
  ontstaan_uit: SmallAPIReference
  betrokken_bij: SmallAPIReference
  verblijfsobjecten: SmallAPIReference
  _adressen: SmallAPIReference
}

interface SoortGrootte {
  code: string
  omschrijving: string
}

interface Sectie {
  _links: Links
  _display: string
  sectie: string
  dataset: string
}

export interface List {
  _links: Links
  count: number
  results: Array<
    Pick<APIReference, '_links' | '_display' | 'landelijk_id' | 'dataset'> & { aanduiding: string }
  >
}
