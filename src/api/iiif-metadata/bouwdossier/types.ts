/* eslint-disable camelcase */
import type { Links } from '../../types'

export type BouwdossierStatus = 'Aanvraag' | 'Behandeling'
export type BouwdossierAccess = 'RESTRICTED' | 'PUBLIC'

export interface Bestand {
  filename: string
  url: string
}

export interface Document {
  access: BouwdossierAccess
  access_restricted_until: string | null
  barcode: string | null
  bestanden: Bestand[]
  copyright: string
  copyright_until: string | null
  copyright_holders: string | null
  copyright_manufacturers: string | null
  document_omschrijving: string | null
  oorspronkelijk_pad: string[]
  subdossier_titel: string | null
}

export interface Adres {
  huisnummer_letter?: string | null
  huisnummer_toevoeging?: string | null
  huisnummer_tot?: number | null
  huisnummer_van?: number | null
  locatie_aanduiding?: string | null
  nummeraanduidingen_label: string[]
  nummeraanduidingen: string[]
  openbareruimte_id: string
  panden: string[]
  straat: string
  verblijfsobjecten_label: string[]
  verblijfsobjecten: string[]
}

export interface Single {
  access: BouwdossierAccess
  activiteiten: string[]
  adressen: Adres[]
  datering: string | true
  documenten: Document[]
  dossier_status?: BouwdossierStatus | null
  dossier_type: string | null
  dossiernr: number
  olo_liaan_nummer?: number | null
  stadsdeel: string
  source: string
  titel: string
}

interface ListResult extends Single {
  _display: string
  _links: Links
}

export interface List {
  _links: Links
  count: number
  results: ListResult[]
}
