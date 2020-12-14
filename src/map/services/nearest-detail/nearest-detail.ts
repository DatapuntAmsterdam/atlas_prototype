import { Feature, Geometry } from 'geojson'
import environment from '../../../environment'
import { fetchWithToken } from '../../../shared/services/api/api'
import { MapLayer, MapLayerType } from '../index'
import MAP_CONFIG from '../map.config'

// TODO: Replace this type with the 'LatLng' type from Leaflet.
type Location = { latitude: number; longitude: number }

const generateParams = (layer: MapLayer, location: Location, zoom: number) => ({
  ...layer.detailParams,
  lat: location.latitude.toString(),
  lon: location.longitude.toString(),
  radius: layer.detailIsShape
    ? '0'
    : Math.round(2 ** (MAP_CONFIG.BASE_LAYER_OPTIONS.maxZoom - zoom) / 2).toString(),
})

export const sortResults = (results: MapLayer[]) =>
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

const retrieveLayers = (
  detailItems: Feature<Geometry, MapLayer>[],
  detailIsShape?: boolean,
): MapLayer[] =>
  detailItems.map((item) => {
    const [type, subType] = item.properties.type.split('/')

    return {
      detailIsShape,
      ...item.properties,
      type: type as MapLayerType,
      subType,
    }
  })

export default async function fetchNearestDetail(
  location: Location,
  layers: MapLayer[],
  zoom: number,
) {
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