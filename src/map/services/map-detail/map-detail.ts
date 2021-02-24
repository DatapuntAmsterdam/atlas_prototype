import servicesByEndpointType, { endpointTypes } from '../map-services.config'
import environment from '../../../environment'
import joinUrl from '../../../app/utils/joinUrl'

export const pageTypeToEndpoint = (type: string, subtype: string, id: string) => {
  const endpointType =
    Object.values(servicesByEndpointType).find(
      ({ type: serviceType }) => serviceType === `${type}/${subtype}`,
    )?.endpoint || `${type}/${subtype}`
  return joinUrl([environment.API_ROOT, endpointType, id], true)
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
