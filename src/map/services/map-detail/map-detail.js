import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'

import mapFetch from '../map-fetch/map-fetch'

import servicesByEndpointType, { endpointTypes } from '../map-services.config'

export const maxDisplayValuesPerProperty = 5

export const pageEndpointTypeMapping = {
  'explosieven/gevrijwaardgebied/': 'milieuthemas/explosieven/gevrijwaardgebied/',
  'explosieven/inslagen/': 'milieuthemas/explosieven/inslagen/',
  'explosieven/uitgevoerdonderzoek/': 'milieuthemas/explosieven/uitgevoerdonderzoek/',
  'explosieven/verdachtgebied/': 'milieuthemas/explosieven/verdachtgebied/',
}

export const pageTypeToEndpoint = (type, subtype, id) => {
  const endpoinType = pageEndpointTypeMapping[`${type}/${subtype}/`] || `${type}/${subtype}/`
  return `${SHARED_CONFIG.API_ROOT}${endpoinType}${id}/`
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
  const endpointType = Object.keys(servicesByEndpointType).find(type => endpoint.includes(type))
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

window.mapPreviewPanelDetailEndpointTypes = endpointTypes
