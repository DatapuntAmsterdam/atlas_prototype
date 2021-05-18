// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { Link } from '../../../types'

export interface Single {
  _links: Links | null
  naam: string | null
  naamNen: string | null
  typeCode: number | null
  geometrie: Geometry | null
  statusCode: number | null
  straatcode: string | null
  volgnummer: number | null
  heeftDossierDossier: string | null
  heeftDossierId: string | null
  bagprocesCode: number | null
  documentdatum: string | null
  geconstateerd: boolean | null
  identificatie: string
  straatnaamPtt: string | null
  documentnummer: string | null
  eindGeldigheid: string | null
  beginGeldigheid: string | null
  beschrijvingNaam: string | null
  ligtInWoonplaatsVolgnummer: number | null
  ligtInWoonplaatsIdentificatie: any | null
  ligtInWoonplaatsId: string | null
  registratiedatum: string | null
  typeOmschrijving: string | null
  statusOmschrijving: string | null
  bagprocesOmschrijving: string | null
  id: string
}

interface Links {
  schema: string
  self: Link
  heeftDossier: Link | null
  ligtInWoonplaats: Link | null
  heeftOnderzoeken: Link[] | null
}
