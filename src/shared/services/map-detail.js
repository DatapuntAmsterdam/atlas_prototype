import getCenter from './geo-json/geo-json'
import { rdToWgs84 } from './coordinate-reference-system/crs-converter'

import { getByUrl } from './api/api'

export default function fetchByUri(uri, normalization) {
  return getByUrl(uri).then(result => {
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
