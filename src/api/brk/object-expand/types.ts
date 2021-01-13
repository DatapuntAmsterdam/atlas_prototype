/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference, Links, SmallAPIReference } from '../../types'

export interface Single extends APIReference {
  id: string
  aanduiding: string
  kadastrale_gemeente: APIReference
  sectie: Sectie
  objectnummer: string
  indexletter: string
  indexnummer: number
  soort_grootte: SoortGrootte
  grootte: string
  meer_objecten: boolean | null
  register9_tekst: string
  status_code: string
  toestandsdatum: string
  voorlopige_kadastrale_grens: boolean
  in_onderzoek: string
  geometrie: Geometry
  ontstaan_uit: any[]
  betrokken_bij: APIReference[]
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
  results: Single[]
}
