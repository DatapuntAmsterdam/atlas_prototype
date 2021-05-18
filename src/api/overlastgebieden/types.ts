// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { Link } from '../types'

export interface Single {
  _links: Links | null
  id: number
  url: string | null
  type: string | null
  soort: any | null
  geometry: Geometry | null
  oovNaam: string | null
  geldigheidPeriode: string | null
  geldigheidSpecificatie: string | null
}

interface Links {
  schema: string
  self: Link
}
