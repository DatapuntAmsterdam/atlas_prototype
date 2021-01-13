/* eslint-disable camelcase */
import { Point } from 'geojson'
import { APIReference, Links, SmallAPIReference } from '../../types'

export interface Single extends APIReference {
  identificerende_sleutel_monument: string
  monumentnummer: number
  monumentnaam: string | null
  monumentstatus: string
  monument_aanwijzingsdatum: any
  betreft_pand: BetreftPand[]
  heeft_als_grondslag_beperking: any
  heeft_situeringen: SmallAPIReference
  monumentcoordinaten: Point
  ligt_in_complex: LigtInComplex | null
  in_onderzoek: string
}

interface BetreftPand {
  pandidentificatie: string
  _links: Links
}

interface LigtInComplex {
  _links: Links
  identificerende_sleutel_complex: string
}

interface ListResult extends Single {
  _links: Links
  _display: string
}

export interface List {
  _links: Links
  count: number
  results: ListResult[]
}
