/* eslint-disable camelcase */
import type { APIReference, Links, SmallAPIReference } from '../../types'

export interface Single extends APIReference {
  id: string
  type: number
  beschikkingsbevoegdheid: any
  is_natuurlijk_persoon: boolean
  voornamen: string
  voorvoegsels: string
  naam: string
  geslacht: Property
  aanduiding_naam: Property
  geboortedatum: string
  geboorteplaats: string
  geboorteland: any
  overlijdensdatum: string
  partner_voornamen: string
  partner_voorvoegsels: string
  partner_naam: string
  land_waarnaar_vertrokken: any
  rsin: any
  kvknummer: any
  rechtsvorm: any
  statutaire_naam: any
  statutaire_zetel: any
  bron: number
  woonadres: Woonadres
  postadres: any
  aantekeningen: SmallAPIReference
}

interface Property {
  code: string
  omschrijving: string
}

interface Woonadres {
  openbareruimte_naam: string
  huisnummer: number
  huisletter: string
  toevoeging: string
  postcode: string
  woonplaats: string
  postbus_nummer: any
  postbus_postcode: any
  postbus_woonplaats: any
  buitenland_adres: string
  buitenland_woonplaats: string
  buitenland_regio: string
  buitenland_naam: string
  buitenland_land: any
}

export interface List {
  _links: Links
  count: number
  results: Pick<APIReference, '_links' | '_display' | 'naam' | 'dataset'>[]
}
