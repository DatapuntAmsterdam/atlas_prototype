import environment from '../../../environment'
import { fetchWithToken } from '../../../shared/services/api/api'
import MAP_CONFIG from '../map.config'

const generateParams = (layer, location, zoom) => ({
  ...layer.detailParams,
  lat: location.latitude,
  lon: location.longitude,
  radius: layer.detailIsShape
    ? 0
    : Math.round(2 ** (MAP_CONFIG.BASE_LAYER_OPTIONS.maxZoom - zoom) / 2),
})

export const sortResults = (results) =>
  results.sort((a, b) => {
    if (a.detailIsShape && b.detailIsShape) {
      return a.distance - b.distance
    }
    if (!a.detailIsShape) {
      if (!b.detailIsShape) {
        return a.distance - b.distance
      }
      return -1
    }
    return 1
  })

const retrieveLayers = (detailItems, detailIsShape) =>
  detailItems.map((item) => ({
    detailIsShape,
    ...item.properties,
  }))

export default async function fetchNearestDetail(location, layers, zoom) {
  const results = sortResults(
    (
      await Promise.all(
        layers.map(async (layer) => {
          const params = generateParams(layer, location, zoom)
          const result = await fetchWithToken(environment.API_ROOT + layer.detailUrl, params)

          return retrieveLayers(result.features, layer.detailIsShape)
        }),
      )
    ).reduce(/* istanbul ignore next */ (a, b) => [...a, ...b]),
  )
  return results[0] ?? null
}
