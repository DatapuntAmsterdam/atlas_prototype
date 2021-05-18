// eslint-disable-next-line import/no-extraneous-dependencies
import type { Geometry } from 'geojson'
import type { CodeWithDescription, Link } from '../../../types'

export interface Single {
  _links: Links | null
  cbsNummer: number | null
  geometrie: Geometry | null
  statusCode: number | null
  volgnummer: number
  ligtInBuurtVolgnummer: number | null
  ligtInBuurtIdentificatie: number | null
  ligtInBuurtId: string | null
  oppervlakte: number | null
  aantalKamers: number | null
  heeftDossierDossier: string | null
  heeftDossierId: string | null
  bagprocesCode: number | null
  documentdatum: string | null
  geconstateerd: boolean | null
  identificatie: string
  documentnummer: string | null
  eindGeldigheid: string | null
  aantalBouwlagen: number | null
  beginGeldigheid: string | null
  heeftHoofdadresVolgnummer: number | null
  heeftHoofdadresIdentificatie: string | null
  heeftHoofdadresId: string | null
  hoogsteBouwlaag: number | null
  laagsteBouwlaag: number | null
  redenafvoerCode: number | null
  redenopvoerCode: number | null
  registratiedatum: string | null
  verdiepingToegang: number | null
  statusOmschrijving: string | null
  feitelijkGebruikCode: number | null
  aantalEenhedenComplex: number | null
  bagprocesOmschrijving: string | null
  financieringscodeCode: number | null
  eigendomsverhoudingCode: number | null
  indicatieWoningvoorraad: string | null
  redenafvoerOmschrijving: string | null
  redenopvoerOmschrijving: string | null
  gebruiksdoelWoonfunctieCode: number | null
  feitelijkGebruikOmschrijving: string | null
  financieringscodeOmschrijving: number | null
  eigendomsverhoudingOmschrijving: string | null
  gebruiksdoelWoonfunctieOmschrijving: string | null
  gebruiksdoelGezondheidszorgfunctieCode: number | null
  gebruiksdoelGezondheidszorgfunctieOmschrijving: string | null
  id: string
  toegang: CodeWithDescription[] | null
  gebruiksdoel: CodeWithDescription[] | null
}

interface Links {
  schema: string
  self: Link
  heeftEenRelatieMetVerblijfsobjectKadastraleobjecten: Link[] | null
  ligtInBuurt: Link | null
  heeftDossier: Link | null
  heeftHoofdadres: Link | null
  ligtInPanden: Link[] | null
  heeftNevenadres: Link[] | null
  heeftOnderzoeken: Link[] | null
}
