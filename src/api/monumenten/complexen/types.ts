/* eslint-disable camelcase */
import type { APIReference, Links, SmallAPIReference } from '../../types'

export interface Single extends APIReference {
  identificerende_sleutel_complex: string
  monumentnummer_complex?: number | null
  complexnaam?: string | null
  monumenten: SmallAPIReference
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
