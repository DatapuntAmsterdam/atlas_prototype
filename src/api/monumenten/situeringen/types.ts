/* eslint-disable camelcase */
import { APIReference, Links } from '../../types'

export interface Root extends APIReference {
  _display: string
  identificerende_sleutel_situering: number
  situering_nummeraanduiding: string
  betreft_nummeraanduiding: BetreftNummeraanduiding
  eerste_situering: string
  hoort_bij_monument: HoortBijMonument
}

export interface HoortBijMonument {
  _links: Links
  identificerende_sleutel_monument: string
}

export interface BetreftNummeraanduiding {
  _links: Links
  nummeraanduidingidentificatie: string
}
