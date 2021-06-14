import type { Geometry } from 'geojson'
import type { Links } from '../../types'

export interface HistorischeOnderzoeken {
  _links: Links
  id: number
  geometrie: Geometry
  permalink: string
  naamRapport: string
  beschrijving: string
  datumRapport: string
  nummerRapport: string
  opdrachtgever: string
  opdrachtnemer: string
  typeOnderzoek: string
  locatieOfAdres: string
  indicatieKwaliteit: string
}
