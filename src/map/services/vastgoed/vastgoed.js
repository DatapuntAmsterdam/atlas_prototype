import { getByUrl } from '../../../shared/services/api/api'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'

import mapFetch from '../map-fetch/map-fetch'
import { vastgoed } from '../normalize/normalize'

export default async function fetchByGeoLocation(location) {
  const url = `${SHARED_CONFIG.API_ROOT}geosearch/vastgoed/?lat=${location.latitude}&lon=${location.longitude}&item=vastgoed&radius=0`

  const result = await getByUrl(url)

  const units = await Promise.all(
    result.features.map(({ properties }) =>
      mapFetch(`${SHARED_CONFIG.API_ROOT}vsd/vastgoed/${properties.id}/`, false, vastgoed),
    ),
  )

  return units
}
