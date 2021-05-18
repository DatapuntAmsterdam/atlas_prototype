import type { LatLngLiteral } from 'leaflet'
import { rdToWgs84 } from '../../../shared/services/coordinate-reference-system'
import getCenter from '../../../shared/services/geo-json/geo-json'
import type { ServiceDefinition } from '../map-services.config'
import type { DetailInfo } from '../../types/details'
import type { DetailResponse } from '../map'
import type { Wsg84Coordinate } from '../../../shared/services/coordinate-reference-system/crs-converter'

export default async function mapFetch(
  result: DetailResponse,
  detailInfo: DetailInfo,
  serviceDefinition: ServiceDefinition,
) {
  const normalizedResult = serviceDefinition.normalization
    ? await serviceDefinition.normalization(result.data)
    : null
  const geometry = result.geometrie ?? result.geometry ?? normalizedResult?.geometry ?? null
  const geometryCenter = geometry && getCenter(geometry)
  const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null
  let location: LatLngLiteral | Wsg84Coordinate | null = result?.location ?? wgs84Center ?? null

  // Some methods do not accept a standard LatLngLiteral, so we need to spread this over.
  if (location) {
    location = {
      ...location,
      // @ts-ignore
      lat: location.latitude ?? location.lat,
      // @ts-ignore
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
    // eslint-disable-next-line no-underscore-dangle
    label: result._display,
    // "label" may be overwritten by the result or normalizedData, but the location and geometry are constructed above
    geometrie: geometry,
    location,
  }
}
