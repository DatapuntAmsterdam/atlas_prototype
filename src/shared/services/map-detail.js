import { fetchWithToken } from './api/api'
import { rdToWgs84 } from './coordinate-reference-system/crs-converter'
import getCenter from './geo-json/geo-json'

export default function fetchByUri(uri, normalization) {
  return fetchWithToken(uri).then((result) => {
    const geometryCenter = result.geometrie && getCenter(result.geometrie)
    const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null

    let normalizedData
    if (normalization) {
      normalizedData = normalization(result)
    }

    return {
      ...(normalizedData || result),
      ...(result.wkb_geometry ? { geometrie: result.wkb_geometry } : {}),
      ...(result.geometry ? { geometrie: result.geometry } : {}), // evenementen
      label: result._display,
      location: result.location || wgs84Center,
    }
  })
}
