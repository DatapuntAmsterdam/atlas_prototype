import { TileLayerOptions } from 'leaflet'
import { MapLayer } from '../../../../map/services'
import MAP_CONFIG from '../../../../map/services/map.config'
import { UserState } from '../../../../shared/ducks/user/user'
import { createUrlWithToken } from '../../../../shared/services/api/api'
import { Overlay } from '../MapContext'

const findLayer = (layers: MapLayer[], id: string) => {
  const idParts = id.split('-').reverse()
  return layers.find((layer) => idParts.includes(layer.id)) ?? null
}

const generateOverlay = (layer: MapLayer, token: string) => {
  if (layer.authScope && !token) {
    return null
  }

  const url = generateUrl(layer, token)

  if (!url) {
    return null
  }

  const params = layer.params ? Object.fromEntries(new URLSearchParams(layer.params)) : undefined

  const overlay: Overlay = {
    id: layer.id,
    type: layer.type,
    params,
    url,
    layer,
    options: {
      ...MAP_CONFIG.OVERLAY_OPTIONS,
      layers: layer.layers?.join(','),
      // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/15313
    } as TileLayerOptions,
  }

  return overlay
}

function generateUrl(layer: MapLayer, token: string) {
  if (!layer.url) {
    return null
  }

  const url = layer.external ? layer.url : `${MAP_CONFIG.OVERLAY_ROOT}${layer.url}`

  if (layer.authScope) {
    return createUrlWithToken(url, token)
  }

  return url
}

export default function buildLeafletLayers(
  activeMapLayers: string[],
  mapLayers: MapLayer[],
  user: UserState,
) {
  return activeMapLayers
    .map((activeMapLayer) => {
      const layer = findLayer(mapLayers, activeMapLayer)

      if (!layer) {
        return null
      }

      const legendLayers = (layer.legendItems ?? [])
        // eslint-disable-next-line no-underscore-dangle
        .map((legendItem) => (legendItem.__typename === 'MapLayer' ? legendItem.id : null))
        .filter((id): id is string => !!id)
        .map((id) => findLayer(mapLayers, id))
        .filter((legendLayer): legendLayer is MapLayer => !!legendLayer)

      return [layer, ...legendLayers].map((item) => generateOverlay(item, user.accessToken))
    })
    .flat()
    .filter((layer): layer is Overlay => !!layer)
}
