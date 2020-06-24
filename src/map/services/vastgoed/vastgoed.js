import { fetchWithToken } from '../../../shared/services/api/api'
import mapFetch from '../map-fetch/map-fetch'
import { vastgoed } from '../normalize/normalize'

export default async function fetchByGeoLocation(location) {
  const url = `${process.env.API_ROOT}geosearch/vastgoed/?lat=${location.latitude}&lon=${location.longitude}&item=vastgoed&radius=0`

  const result = await fetchWithToken(url)

  const units = await Promise.all(
    result.features.map(({ properties }) =>
      mapFetch(`${process.env.API_ROOT}vsd/vastgoed/${properties.id}/`, false, vastgoed),
    ),
  )

  return units
}
