import { Link } from '../../../types'

export interface Single {
  _links: Links | null
  postcode: string | null
  typeAdres: string | null
  huisletter: any | null
  huisnummer: number | null
  statusCode: number | null
  volgnummer: number | null
  heeftDossierDossier: string | null
  heeftDossierId: string | null
  bagprocesCode: any | null
  documentdatum: string | null
  geconstateerd: boolean | null
  identificatie: string | null
  documentnummer: string | null
  eindGeldigheid: any | null
  beginGeldigheid: string | null
  ligtInWoonplaatsVolgnummer: number | null
  ligtInWoonplaatsIdentificatie: string | null
  ligtInWoonplaatsId: string | null
  registratiedatum: string | null
  statusOmschrijving: string | null
  adresseertLigplaatsVolgnummer: any | null
  adresseertLigplaatsIdentificatie: any | null
  adresseertLigplaatsId: string | null
  huisnummertoevoeging: string | null
  adresseertStandplaatsVolgnummer: any | null
  adresseertStandplaatsIdentificatie: any | null
  adresseertStandplaatsId: string | null
  bagprocesOmschrijving: any | null
  ligtAanOpenbareruimteVolgnummer: number | null
  ligtAanOpenbareruimteIdentificatie: string | null
  ligtAanOpenbareruimteId: string | null
  adresseertVerblijfsobjectVolgnummer: number | null
  adresseertVerblijfsobjectIdentificatie: string | null
  adresseertVerblijfsobjectId: string | null
  typeAdresseerbaarObjectCode: number | null
  typeAdresseerbaarObjectOmschrijving: string | null
  id: string
}

interface Links {
  schema: string
  self: Link
  heeftNevenadresStandplaatsen: Link[] | null
  heeftNevenadresLigplaatsen: Link[] | null
  heeftNevenadresVerblijfsobjecten: Link[] | null
  heeftDossier: Link | null
  ligtInWoonplaats: Link | null
  adresseertLigplaats: Link | null
  adresseertStandplaats: Link | null
  ligtAanOpenbareruimte: Link | null
  adresseertVerblijfsobject: Link | null
  heeftOnderzoeken: Link[] | null
}
