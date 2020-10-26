/* eslint-disable camelcase */
export type BouwdossierStatus = 'Aanvraag' | 'Behandeling'
export type BouwdossierAccess = 'RESTRICTED' | 'PUBLIC'

export type Bestanden = {
  filename: string
  url: string
}

export type Documenten = {
  access: BouwdossierAccess
  barcode: string
  bestanden: Bestanden[]
  document_omschrijving?: string
  oorspronkelijk_pad: string[]
  subdossier_titel: string
}

export type Adressen = {
  huisnummer_letter?: string
  huisnummer_toevoeging?: string
  huisnummer_tot?: number
  huisnummer_van?: number
  locatie_aanduiding?: string
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
  activiteiten: any[]
  adressen: Adressen[]
  datering: string
  documenten: Documenten[]
  dossier_status?: BouwdossierStatus | null
  dossier_type: string
  dossiernr: number
  olo_liaan_nummer?: number | null
  stadsdeel: string
  titel: string
}
