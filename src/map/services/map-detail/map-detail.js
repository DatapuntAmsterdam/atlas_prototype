import mapFetch from '../map-fetch/map-fetch'
import servicesByEndpointType, { endpointTypes } from '../map-services.config'

export const pageEndpointTypeMapping = {
  'bag/ligplaats/': 'bag/v1.1/ligplaats/',
  'bag/nummeraanduiding/': 'bag/v1.1/nummeraanduiding/',
  'bag/openbareruimte/': 'bag/v1.1/openbareruimte/',
  'bag/pand/': 'bag/v1.1/pand/',
  'bag/standplaats/': 'bag/v1.1/standplaats/',
  'bag/verblijfsobject/': 'bag/v1.1/verblijfsobject/',
  'bag/woonplaats/': 'bag/v1.1/woonplaats/',
  'explosieven/gevrijwaardgebied/': 'milieuthemas/explosieven/gevrijwaardgebied/',
  'explosieven/inslagen/': 'milieuthemas/explosieven/inslagen/',
  'explosieven/uitgevoerdonderzoek/': 'milieuthemas/explosieven/uitgevoerdonderzoek/',
  'explosieven/verdachtgebied/': 'milieuthemas/explosieven/verdachtgebied/',
  'fietspaaltjes/fietspaaltjes/': 'v1/fietspaaltjes/fietspaaltjes/',
  'grex/projecten/': 'v1/grex/projecten/',
  'parkeervakken/parkeervakken/': 'v1/parkeervakken/parkeervakken/',
}

export const pageTypeToEndpoint = (type, subtype, id) => {
  const endpointType = pageEndpointTypeMapping[`${type}/${subtype}/`] || `${type}/${subtype}/`
  return `${process.env.API_ROOT}${endpointType}${id}/`
}

export const getEndpointTypeForResult = (endpointType, detail) => {
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

export default async function fetchDetail(endpoint, user) {
  const endpointType = Object.keys(servicesByEndpointType).find((type) => endpoint.includes(type))
  const endpointConfig = endpointType && servicesByEndpointType[endpointType]
  const authScope = endpointConfig && endpointConfig.authScope
  const isAuthorized = !authScope || user.scopes.includes(authScope)

  const detail = isAuthorized
    ? await mapFetch(endpoint, endpointConfig.mapDetail, endpointConfig.normalization)
    : endpointConfig.mapDetail(isAuthorized)

  const endpointTypeForResult = getEndpointTypeForResult(endpointType, detail)

  return {
    ...detail,
    isAuthorized,
    endpointType: endpointTypeForResult,
  }
}
