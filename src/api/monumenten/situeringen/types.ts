/* eslint-disable camelcase */
import type { APIReference, Links } from '../../types'

export interface Single extends APIReference {
  _display: string
  identificerende_sleutel_situering: number
  situering_nummeraanduiding: string
  betreft_nummeraanduiding: {
    _links: Links
    nummeraanduidingidentificatie: string
  }
  eerste_situering: string
  hoort_bij_monument: {
    _links: Links
    identificerende_sleutel_monument: string
  }
}

interface ListResult extends Single {
  _links: Links
}

export interface List {
  _links: Links
  count: number
  results: ListResult[]
}
