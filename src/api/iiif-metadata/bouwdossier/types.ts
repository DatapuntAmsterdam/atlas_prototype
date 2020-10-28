/* eslint-disable camelcase */
export type BouwdossierStatus = 'Aanvraag' | 'Behandeling'
export type BouwdossierAccess = 'RESTRICTED' | 'PUBLIC'

export type Bestand = {
  filename: string
  url: string
}

export type Document = {
  access: BouwdossierAccess
  barcode: string | null
  bestanden: Bestand[]
  document_omschrijving: string | null
  oorspronkelijk_pad: string[]
  subdossier_titel: string | null
}

export type Adres = {
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

export type Bouwdossier = {
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
  titel: string
}
