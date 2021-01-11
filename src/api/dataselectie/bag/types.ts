/* eslint-disable camelcase */
export type Root = {
  aggs_list: AggsList
  object_list: ObjectList[]
  object_count: number
  page_count: number
}

export type AggsList = {
  ggw_code: GgwCode
  stadsdeel_naam: StadsdeelNaam
  buurt_code: BuurtCode
  openbare_ruimte: OpenbareRuimte
  postcode: Postcode
  buurt_naam: BuurtNaam
  buurtcombinatie_naam: BuurtcombinatieNaam
  stadsdeel_code: StadsdeelCode
  buurtcombinatie_code: BuurtcombinatieCode
  ggw_naam: GgwNaam
}

export type GgwCode = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket[]
  doc_count: number
}

export type Bucket = {
  key: string
  doc_count: number
}

export type StadsdeelNaam = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket2[]
  doc_count: number
}

export type Bucket2 = {
  key: string
  doc_count: number
}

export type BuurtCode = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket3[]
  doc_count: number
}

export type Bucket3 = {
  key: string
  doc_count: number
}

export type OpenbareRuimte = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket4[]
  doc_count: number
}

export type Bucket4 = {
  key: string
  doc_count: number
}

export type Postcode = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket5[]
  doc_count: number
}

export type Bucket5 = {
  key: string
  doc_count: number
}

export type BuurtNaam = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket6[]
  doc_count: number
}

export type Bucket6 = {
  key: string
  doc_count: number
}

export type BuurtcombinatieNaam = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket7[]
  doc_count: number
}

export type Bucket7 = {
  key: string
  doc_count: number
}

export type StadsdeelCode = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket8[]
  doc_count: number
}

export type Bucket8 = {
  key: string
  doc_count: number
}

export type BuurtcombinatieCode = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket9[]
  doc_count: number
}

export type Bucket9 = {
  key: string
  doc_count: number
}

export type GgwNaam = {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket10[]
  doc_count: number
}

export type Bucket10 = {
  key: string
  doc_count: number
}

export type ObjectList = {
  nummeraanduiding_id: string
  naam: string
  woonplaats: string
  huisnummer: number
  huisletter: string
  huisnummer_toevoeging: string
  postcode: string
  _openbare_ruimte_naam: string
  buurt_naam: string
  buurtcombinatie_naam: string
  status: string
  stadsdeel_code: string
  stadsdeel_naam: string
  openbare_ruimte_landelijk_id: string
  landelijk_id: string
  type_adres: string
  centroid: number[]
  ggw_code: string
  ggw_naam: string
  buurt_code: string
  buurtcombinatie_code: string
  type_desc: string
  verblijfsobject?: string
  oppervlakte?: number
  bouwblok?: string
  gebruik?: string
  aantal_kamers?: number
  bouwlagen?: number
  eigendomsverhouding?: string
  geconstateerd?: string
  in_onderzoek?: string
  gebruiksdoel?: string
  toegang?: string
  panden?: string
  pandnaam?: string
  bouwjaar?: string
  type_woonobject?: string
  ligging?: string
  verdieping_toegang?: number
  hoogste_bouwlaag?: number
  laagste_bouwlaag?: number
  ligplaats?: string
  gebruiksdoel_woonfunctie?: string
  aantal_eenheden_complex?: number
}
