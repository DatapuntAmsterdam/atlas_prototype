import type { Geometry } from 'geojson'
import type { Links } from '../../types'

export interface HistorischeOnderzoeken {
  _links: Links
  id: number
  geometrie: Geometry | null
  permalink: string | null
  naamRapport: string | null
  beschrijving: string | null
  datumRapport: string | null
  nummerRapport: string | null
  opdrachtgever: string | null
  opdrachtnemer: string | null
  typeOnderzoek: string | null
  locatieOfAdres: string | null
  indicatieKwaliteit: string | null
}
