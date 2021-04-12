import { Links } from '../../../types'

export interface List {
  _embedded: Embedded
  _links: Links
  page: Page
}

export interface Embedded {
  nummeraanduiding: Nummeraanduiding[]
}

export interface Nummeraanduiding {
  beginGeldigheid?: string
  bron?: string | null
  bronId?: string | null
  dateModified?: string
  documentMutatie?: string
  documentNummer?: string | null
  eindeGeldigheid?: string | null
  huisletter?: string
  huisnummer?: number
  huisnummerToevoeging?: string
  id?: string
  landelijkId?: string
  ligplaats?: string | null
  ligplaatsId?: string | null
  openbareRuimte?: string
  openbareRuimteId?: string
  postcode?: string
  schema?: string
  standplaats?: string | null
  standplaatsId?: string | null
  status?: string
  type?: string
  typeAdres?: string
  verblijfsobject?: string
  verblijfsobjectId?: string
  vervallen?: number | null
}

export interface Page {
  number: number
  size: number
  totalElements: number
  totalPages: number
}
