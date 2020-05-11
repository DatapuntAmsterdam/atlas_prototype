import { createSelector } from 'reselect'

import { createUrlWithToken } from '../../../shared/services/api/api'
import { getMapOverlays } from '../map/selectors'
import MAP_CONFIG from '../../services/map.config'

export const FETCH_MAP_LAYERS_REQUEST = 'FETCH_MAP_LAYERS_REQUEST'
export const FETCH_MAP_LAYERS_SUCCESS = 'FETCH_MAP_LAYERS_SUCCESS'
export const FETCH_MAP_LAYERS_FAILURE = 'FETCH_MAP_LAYERS_FAILURE'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

export const findLayer = (layers, id) =>
  layers.find((mapLayer) => {
    const mapLayerId = id.split('-')

    // The ID of the mapLayer when defined as part of a collection or as legendItem, is a combination of the IDs of the mapLayer and the collection it's used in
    return mapLayer.id === (mapLayerId[1] || mapLayerId[0])
  })

const generateLayer = (layers, overlay, url, params, type, bounds) => ({
  ...overlay,
  url,
  overlayOptions: {
    ...MAP_CONFIG.OVERLAY_OPTIONS,
    layers: findLayer(layers, overlay.id).layers,
  },
  type,
  params,
  bounds,
})
export const getMapLayers = (state) => state.mapLayers.layers.items
export const getAccessToken = (state) => state.user.accessToken

export const getLayers = createSelector(
  [getMapOverlays, getAccessToken, getMapLayers],
  (overlays, token, layers) =>
    overlays
      .map((overlay) => {
        const layer = findLayer(layers, overlay.id)
        if (!layer) {
          return false
        }

        const layerUrl = layer.external ? layer.url : `${MAP_CONFIG.OVERLAY_ROOT}${layer.url}`
        if (!layer.authScope) {
          return generateLayer(layers, overlay, layerUrl, layer.params, layer.type, layer.bounds)
        }
        if (token) {
          return generateLayer(
            layers,
            overlay,
            createUrlWithToken(layerUrl, token),
            layer.params,
            layer.type,
            layer.bounds,
          )
        }
        return false
      })
      .filter((layer) => layer),
)

export default function MapLayersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAP_LAYERS_REQUEST:
      return { ...state, isLoading: true, error: null }

    case FETCH_MAP_LAYERS_SUCCESS:
      return { ...state, isLoading: false, items: action.mapLayers }

    case FETCH_MAP_LAYERS_FAILURE:
      return { ...state, isLoading: false, error: action.error }

    default:
      return state
  }
}

export const fetchMapLayers = () => ({ type: FETCH_MAP_LAYERS_REQUEST })
