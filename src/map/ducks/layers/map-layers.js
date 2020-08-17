import { createSelector } from 'reselect'
import { createUrlWithToken } from '../../../shared/services/api/api'
import MAP_CONFIG from '../../services/map.config'
import { getMapOverlays } from '../map/selectors'

export const FETCH_MAP_LAYERS_REQUEST = 'FETCH_MAP_LAYERS_REQUEST'
export const FETCH_MAP_LAYERS_SUCCESS = 'FETCH_MAP_LAYERS_SUCCESS'
export const FETCH_MAP_LAYERS_FAILURE = 'FETCH_MAP_LAYERS_FAILURE'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

const findLayer = (layers, id) =>
  layers.find((mapLayer) => {
    const mapLayerId = id.split('-')

    // The ID of the mapLayer when defined as part of a collection or as legendItem, is a combination of the IDs of the mapLayer and the collection it's used in
    return mapLayer.id === (mapLayerId[1] || mapLayerId[0])
  })

export const getMapLayers = (state) => state.mapLayers.layers.items
export const getAccessToken = (state) => state.user.accessToken

const generateLayer = (overlay, layer, token) => {
  if (!layer.url) {
    return false
  }

  if (layer.authScope && !token) {
    return false
  }

  return {
    id: layer.id,
    type: layer.type,
    params: layer.params,
    bounds: layer.bounds,
    url: generateUrl(layer, token),
    isVisible: overlay.isVisible,
    overlayOptions: {
      ...MAP_CONFIG.OVERLAY_OPTIONS,
      layers: layer.layers,
    },
  }
}

function generateUrl(layer, token) {
  const url = layer.external ? layer.url : `${MAP_CONFIG.OVERLAY_ROOT}${layer.url}`

  if (layer.authScope) {
    return createUrlWithToken(url, token)
  }

  return url
}

export const getLayers = createSelector(
  [getMapOverlays, getAccessToken, getMapLayers],
  (overlays, token, layers) =>
    overlays
      .map((overlay) => {
        const layer = findLayer(layers, overlay.id)

        if (!layer) {
          return false
        }

        const legendLayers = (layer.legendItems ?? [])
          .map((legendItem) => legendItem.id)
          .filter((id) => !!id)
          .map((id) => findLayer(layers, id))
          .filter((legendLayer) => !!legendLayer)

        return [layer, ...legendLayers].map((item) => generateLayer(overlay, item, token))
      })
      .flat()
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
