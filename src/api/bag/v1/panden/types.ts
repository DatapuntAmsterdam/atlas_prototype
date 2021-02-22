// eslint-disable-next-line import/no-extraneous-dependencies
import { Geometry } from 'geojson'
import { Link } from '../../../types'

export interface Single {
  _links: Links | null
  naam: string | null
  geometrie: Geometry | null
  statusCode: number | null
  volgnummer: number
  liggingCode: number | null
  heeftDossierDossier: string | null
  heeftDossierId: string | null
  bagprocesCode: number | null
  documentdatum: string | null
  geconstateerd: boolean | null
  identificatie: string
  documentnummer: string | null
  eindGeldigheid: string | null
  ligtInBouwblokVolgnummer: number | null
  ligtInBouwblokIdentificatie: string | null
  ligtInBouwblokId: string | null
  typeWoonobject: string | null
  aantalBouwlagen: number | null
  beginGeldigheid: string | null
  hoogsteBouwlaag: number | null
  laagsteBouwlaag: number | null
  registratiedatum: string | null
  statusOmschrijving: string | null
  liggingOmschrijving: string | null
  bagprocesOmschrijving: string | null
  oorspronkelijkBouwjaar: number | null
  id: string
}

interface Links {
  schema: string
  self: Link
  ligtInPandenVerblijfsobjecten: Link[] | null
  heeftDossier: Link | null
  ligtInBouwblok: Link | null
  heeftOnderzoeken: Link[] | null
}
