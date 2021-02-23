import { Link } from '../../types'

export interface BagList<T> {
  _links: {
    self: Link
    next: Link
    previous: Link
  }
  _embedded: T
  page: {
    number: number
    size: number
    totalElements: number
    totalPages: number
  }
}

export interface CodeWithDescription {
  code: string
  omschrijving: string
}
