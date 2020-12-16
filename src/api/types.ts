/* eslint-disable camelcase */
export interface Links {
  self: Link
  next?: Link
  previous?: Link
}

interface Link {
  href: string | null
  title?: string
}

export interface SmallAPIReference {
  count?: number
  href: string
}

export interface APIReference {
  _links: Links
  _display?: string
  code?: string
  naam?: string
  dataset?: string
  vollcode?: string
  landelijk_id?: string
  type_adres?: string
  vbo_status?: string
}
