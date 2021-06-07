import type { Polygon } from 'geojson'

export interface Parkeervak {
  id: string
  type: string | null
  eType: string | null
  soort: string | null
  aantal: number | null
  geometry: Polygon
  buurtcode: string | null
  straatnaam: string | null
  regimes: ParkeervakRegime[]
}

export interface ParkeervakRegime {
  bord: string | null
  dagen: string[] | null
  eType: string | null
  soort: string | null
  aantal: number | null
  eindTijd: string | null
  kenteken: string | null
  beginTijd: string | null
  eindDatum: string | null
  opmerking: string | null
  beginDatum: string | null
  eTypeDescription: string | null
}
