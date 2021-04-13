export interface ObjectDetail {
  dataset?: string
  kvk_nummer?: string
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
  verblijfsobject: string
  oppervlakte: number
  bouwblok: string
  gebruik: string
  aantal_kamers: number
  bouwlagen: number
  eigendomsverhouding: string
  geconstateerd: string
  in_onderzoek: string
  gebruiksdoel: string
  toegang: string
  panden: string
  pandnaam: string
  bouwjaar: string
  type_woonobject: string
  ligging: string
}

export interface Bucket {
  key: string
  doc_count: number
}

interface AggsValue {
  doc_count_error_upper_bound: number
  sum_other_doc_count: number
  buckets: Bucket[]
  doc_count: number
}
export interface AggsList {
  ggw_code: AggsValue
  stadsdeel_naam: AggsValue
  buurt_code: AggsValue
  openbare_ruimte: AggsValue
  postcode: AggsValue
  buurt_naam: AggsValue
  woonplaats: AggsValue
  buurtcombinatie_naam: AggsValue
  stadsdeel_code: AggsValue
  buurtcombinatie_code: AggsValue
  ggw_naam: AggsValue
}
