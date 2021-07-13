import type { TileLayerOptions } from 'leaflet'
import { createUrlWithToken } from '../../../../shared/services/api/api'
import { getAccessToken } from '../../../../shared/services/auth/auth'
import type { ExtendedMapGroup, ExtendedMapGroupLegendItem } from '../legacy/services'
import MAP_CONFIG from '../legacy/services/map.config'
import type { Overlay } from '../MapContext'

const findLayer = (layers: Array<ExtendedMapGroup & ExtendedMapGroupLegendItem>, id: string) => {
  return layers.find((layer) => id === layer.id) ?? null
}

const generateOverlay = (layer: ExtendedMapGroup & ExtendedMapGroupLegendItem, token: string) => {
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
    // @ts-ignore
    type: layer.type,
    params,
    url,
    // @ts-ignore
    layer,
    options: {
      ...MAP_CONFIG.OVERLAY_OPTIONS,
      layers: layer.layers?.join(','),
      // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/15313
    } as TileLayerOptions,
  }

  return overlay
}

function generateUrl(layer: ExtendedMapGroup & ExtendedMapGroupLegendItem, token: string) {
  if (!layer.url) {
    return null
  }

  const url = layer.external ? layer.url : `${MAP_CONFIG.OVERLAY_ROOT}${layer.url}`

  if (layer.authScope) {
    return createUrlWithToken(url, token)
  }

  return url
}

// Todo legacy code: a LOT is going on here, this should be refactored / simplified
export default function buildLeafletLayers(
  activeMapLayers: string[],
  mapLayers: Array<ExtendedMapGroup & ExtendedMapGroupLegendItem>,
) {
  return activeMapLayers
    .map((activeLegendId) => {
      const layer = findLayer(mapLayers, activeLegendId)

      if (!layer) {
        return null
      }

      const legendLayers = (layer.legendItems ?? [])
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        .map((legendItem) => (legendItem.__typename === 'MapLayer' ? legendItem.id : null))
        .filter((id): id is string => !!id)
        .map((id) => findLayer(mapLayers, id))
        // @ts-ignore
        .filter((legendLayer): legendLayer is ExtendedMapGroup => !!legendLayer) as any

      return [layer, ...legendLayers].map((item) => generateOverlay(item, getAccessToken()))
    })
    .flat()
    .filter((layer): layer is Overlay => !!layer)
}
