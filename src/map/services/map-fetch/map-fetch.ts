import { rdToWgs84 } from '../../../shared/services/coordinate-reference-system/crs-converter'
import getCenter from '../../../shared/services/geo-json/geo-json'
import { ServiceDefinition } from '../map-services.config'
import { DetailInfo } from '../../types/details'

export default async function mapFetch(
  result: any,
  detailInfo: DetailInfo,
  serviceDefinition: ServiceDefinition,
) {
  const normalizedResult = serviceDefinition.normalization
    ? await serviceDefinition.normalization(result.data)
    : null
  const geometry = result.geometrie ?? result.geometry ?? normalizedResult?.geometry ?? null
  const geometryCenter = geometry && getCenter(geometry)
  const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null
  let location = result?.location ?? wgs84Center ?? null

  // Some methods do not accept a standard LatLngLiteral, so we need to spread this over.
  if (location) {
    location = {
      ...location,
      lat: location.latitude ?? location.lat,
      lng: location.longitude ?? location.lng,
    }
  }

  const details = await serviceDefinition.mapDetail(
    normalizedResult ?? result.data,
    detailInfo,
    location,
  )

  return {
    data: details,
    label: result._display,
    // "label" may be overwritten by the result or normalizedData, but the location and geometry are constructed above
    geometrie: geometry,
    location,
  }
}
