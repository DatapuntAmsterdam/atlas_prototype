// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { Link } from '../types'

export interface Single {
  _links: Links | null
  id: number
  url: string | null
  type: string | null
  soort: any | null
  geometry: Geometry | null
  oovNaam: string | null
}

interface Links {
  schema: string
  self: Link
}
