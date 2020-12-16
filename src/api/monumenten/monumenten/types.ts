/* eslint-disable camelcase */
import { Geometry } from 'geojson'
import { APIReference, Links, SmallAPIReference } from '../../types'

export interface Root extends APIReference {
  identificerende_sleutel_monument: string
  monumentnummer: number
  monumentnaam: string
  monumentstatus: string
  monument_aanwijzingsdatum: any
  betreft_pand: BetreftPand[]
  heeft_als_grondslag_beperking: any
  heeft_situeringen: SmallAPIReference
  monumentcoordinaten: Geometry
  ligt_in_complex: any
  in_onderzoek: string
}

export interface BetreftPand {
  pandidentificatie: string
  _links: Links
}
