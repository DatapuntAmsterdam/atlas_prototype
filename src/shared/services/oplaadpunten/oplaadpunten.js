import getCenter from '../geo-json/geo-json'
import { rdToWgs84 } from '../coordinate-reference-system/crs-converter'

import { getByUrl } from '../api/api'

const CHARGER_TYPES = {
  REGULAR: 'Gewoon laadpunt',
  FAST: 'Snellaadpunt',
}

export default function fetchByUri(uri) {
  return getByUrl(uri).then(result => {
    const geometryCenter = result.wkb_geometry && getCenter(result.wkb_geometry)
    const wgs84Center = geometryCenter ? rdToWgs84(geometryCenter) : null

    const address = result.street
      ? `${result.street} ${
          result.housenumberext
            ? `${result.housenumber} ${result.housenumberext},`
            : `${result.housenumber},`
        } ${result.city}`
      : null

    // eslint-disable-next-line no-nested-ternary
    const type = result.charging_cap_max
      ? result.charging_cap_max >= 50
        ? CHARGER_TYPES.FAST
        : CHARGER_TYPES.REGULAR
      : null

    const currentStatus =
      // eslint-disable-next-line no-nested-ternary
      result.status === 'Available'
        ? result.charging_point >= 2
          ? 'Eén of meerdere beschikbaar'
          : 'Beschikbaar'
        : 'Niet beschikbaar'

    return {
      address,
      capacity: result.charging_capability,
      connectorType: result.connector_type,
      geometrie: result.wkb_geometry,
      label: result._display,
      location: wgs84Center,
      quantity: result.charging_point && result.charging_point.toString(),
      currentStatus,
      type,
    }
  })
}
