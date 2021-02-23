// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { CodeWithDescription, Link } from '../../../types'

export interface Single {
  _links: Links | null
  geometrie: Geometry | null
  statusCode: number | null
  volgnummer: number
  ligtInBuurtVolgnummer: number | null
  ligtInBuurtIdentificatie: string | null
  ligtInBuurtId: string | null
  heeftDossierDossier: string | null
  heeftDossierId: string | null
  bagprocesCode: number | null
  documentdatum: string | null
  geconstateerd: boolean | null
  identificatie: string
  documentnummer: string | null
  eindGeldigheid: string | null
  beginGeldigheid: string | null
  heeftHoofdadresVolgnummer: number | null
  heeftHoofdadresIdentificatie: string | null
  heeftHoofdadresId: string | null
  registratiedatum: string | null
  statusOmschrijving: string | null
  bagprocesOmschrijving: string | null
  id: string
  gebruiksdoel: CodeWithDescription[] | null
}

interface Links {
  schema: string
  self: Link
  ligtInBuurt: Link | null
  heeftDossier: Link | null
  heeftHoofdadres: Link | null
  heeftNevenadres: Link[] | null
  heeftOnderzoeken: Link[] | null
}
