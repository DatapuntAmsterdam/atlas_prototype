import { fetchWithToken } from '../../../shared/services/api/api'
import { rdToWgs84 } from '../../../shared/services/coordinate-reference-system/crs-converter'
import getCenter from '../../../shared/services/geo-json/geo-json'
import { ServiceDefinition } from '../map-services.config'

export default async function mapFetch(
  uri: string,
  detail?: ServiceDefinition['mapDetail'],
  normalization?: ServiceDefinition['normalization'],
) {
  const result = await fetchWithToken(uri)
  const normalizedResult = normalization ? await normalization(result) : null
  const geometry = result.geometrie ?? result.geometry ?? normalizedResult?.geometry ?? null
  const geometryCenter = geometry && getCenter(geometry)
  const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null
  let location = normalizedResult?.location ?? wgs84Center ?? null

  // Some methods do not accept a standard LatLngLiteral, so we need to spread this over.
  if (location) {
    location = {
      ...location,
      lat: location.latitude,
      lng: location.longitude,
    }
  }

  const details = await (detail
    ? detail(normalizedResult ?? result, location)
    : normalizedResult ?? result)

  return {
    label: result._display,
    ...details,
    // "label" may be overwritten by the result or normalizedData, but the location and geometry are constructed above
    geometrie: geometry,
    location,
  }
}
