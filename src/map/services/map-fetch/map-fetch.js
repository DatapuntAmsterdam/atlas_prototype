import { fetchWithToken } from '../../../shared/services/api/api'
import { rdToWgs84 } from '../../../shared/services/coordinate-reference-system/crs-converter'
import getCenter from '../../../shared/services/geo-json/geo-json'

export default async function fetchByUri(uri, detail = false, normalization = false) {
  const result = await fetchWithToken(uri)

  // as some APIs return data in a different format than the frontend wants to display
  // some API results are normalized or even enhanced with results from additional API calls
  let normalizedData = false
  if (normalization) {
    normalizedData = await normalization(result)
  }

  // "geometrie" is often returned from the instance API, "gemoetry" is created by the normalizers
  const geometry = result.geometrie || result.geometry || normalizedData.geometry || false

  const geometryCenter = geometry && getCenter(geometry)
  const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null
  let location = result.location || wgs84Center

  // Some methods do not accept a standard LatLngLiteral, so we need to spread this over.
  location = {
    ...location,
    lat: location.latitude,
    lng: location.longitude,
  }

  const mapDetails = detail ? detail(normalizedData || result, location) : normalizedData || result
  const details = mapDetails instanceof Promise ? await mapDetails : mapDetails

  return {
    label: result._display,
    ...details,
    // "label" may be overwritten by the result or normalizedData, but the location and geometry are constructed above
    geometrie: geometry,
    location,
  }
}
