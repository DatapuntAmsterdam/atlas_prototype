import { endpointTypes } from '../map-services.config'
import environment from '../../../environment'

export const pageEndpointTypeMapping = {
  'bag/ligplaats/': 'bag/v1.1/ligplaats/',
  'bag/nummeraanduiding/': 'bag/v1.1/nummeraanduiding/',
  'bag/openbareruimte/': 'bag/v1.1/openbareruimte/',
  'bag/pand/': 'bag/v1.1/pand/',
  'bag/standplaats/': 'bag/v1.1/standplaats/',
  'bag/verblijfsobject/': 'bag/v1.1/verblijfsobject/',
  'bag/woonplaats/': 'bag/v1.1/woonplaats/',
  'bouwstroompunten/bouwstroompunten/': 'v1/bouwstroompunten/bouwstroompunten/',
  'explosieven/gevrijwaardgebied/': 'milieuthemas/explosieven/gevrijwaardgebied/',
  'explosieven/inslagen/': 'milieuthemas/explosieven/inslagen/',
  'explosieven/uitgevoerdonderzoek/': 'milieuthemas/explosieven/uitgevoerdonderzoek/',
  'explosieven/verdachtgebied/': 'milieuthemas/explosieven/verdachtgebied/',
  'fietspaaltjes/fietspaaltjes/': 'v1/fietspaaltjes/fietspaaltjes/',
  'grex/projecten/': 'v1/grex/projecten/',
  'parkeervakken/parkeervakken/': 'v1/parkeervakken/parkeervakken/',
  'bouwdossiers/bouwdossier/': 'iiif-metadata/bouwdossier/',
  'precariobelasting/woonschepen/': 'v1/precariobelasting/woonschepen/',
  'precariobelasting/bedrijfsvaartuigen/': 'v1/precariobelasting/bedrijfsvaartuigen/',
  'precariobelasting/passagiersvaartuigen/': 'v1/precariobelasting/passagiersvaartuigen/',
  'precariobelasting/terrassen/': 'v1/precariobelasting/terrassen/',
  'hoofdroutes/tunnels_gevaarlijke_stoffen/': 'v1/hoofdroutes/tunnels_gevaarlijke_stoffen/',
  'covid_19/aanlegverbod/': 'v1/covid_19/aanlegverbod/',
  'covid_19/straatartiestverbod/': 'v1/covid_19/straatartiestverbod/',
  'covid_19/alcoholverkoopverbod/': 'v1/covid_19/alcoholverkoopverbod/',
  'covid_19/mondmaskerverplichting/': 'v1/covid_19/mondmaskerverplichting/',
  'covid_19/gebiedsverbod/': 'v1/covid_19/gebiedsverbod/',
}

export const pageTypeToEndpoint = (type: string, subtype: string, id: string) => {
  const endpointType = pageEndpointTypeMapping[`${type}/${subtype}/`] || `${type}/${subtype}/`
  return `${environment.API_ROOT}${endpointType}${id}/`
}

export const getEndpointTypeForResult = (endpointType: string, detail: any) => {
  if (endpointType === endpointTypes.adressenNummeraanduiding) {
    if (detail.ligplaats) {
      return endpointTypes.adressenLigplaats
    }
    if (detail.standplaats) {
      return endpointTypes.adressenStandplaats
    }
    return endpointTypes.adressenNummeraanduiding
  }
  return endpointType
}
