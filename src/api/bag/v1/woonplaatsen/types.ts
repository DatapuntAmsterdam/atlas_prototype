// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { Link, SmallAPIReference } from '../../../types'

export interface Single {
  volgnummer: number
  identificatie: string
  id: string
  _links: Links | null
  naam: string | null
  geometrie: Geometry | null
  statusCode: number | null
  heeftDossierDossier: string | null
  heeftDossierId: string | null
  bagprocesCode: number | null
  documentdatum: string | null
  geconstateerd: string | null
  woonplaatsPtt: string | null
  documentnummer: string | null
  eindGeldigheid: string | null
  ligtInGemeenteIdentificatie: string | null
  ligtInGemeenteId: string | null
  beginGeldigheid: string | null
  registratiedatum: string | null
  amsterdamseSleutel: any | null
  statusOmschrijving: string | null
  bagprocesOmschrijving: string | null
  openbareruimtes?: SmallAPIReference
}

interface Links {
  schema: string
  self: Link
  heeftDossier: Link
  ligtInGemeente: Link
  heeftOnderzoeken:
    | string[]
    | {
        identificatie: string | null
        volgnummer: number | null
      }
    | null
}
