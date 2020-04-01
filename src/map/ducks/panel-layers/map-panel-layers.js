import { createSelector } from 'reselect'
import { getMapOverlays, getMapZoom } from '../map/selectors'

export const FETCH_PANEL_ITEMS_REQUEST = 'FETCH_PANEL_ITEMS_REQUEST'
export const FETCH_PANEL_ITEMS_SUCCESS = 'FETCH_PANEL_ITEMS_SUCCESS'
export const FETCH_PANEL_ITEMS_FAILURE = 'FETCH_PANEL_ITEMS_FAILURE'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

export const getActiveMapLayers = ({ map, mapLayers, user }) =>
  map.overlays
    .filter((overlay) => overlay.isVisible)
    .map((overlay) => {
      const overlayId = overlay.id.split('-')[1] || overlay.id // The active mapLayer must be matched to the original mapLayer independent of the collection it's in
      const mapLayer = mapLayers.layers.items.find((layer) => layer.id === overlayId) || {}

      return {
        ...mapLayer,
        id: overlay.id, // We want to preserve the ID of the overlay
      }
    })
    .filter((layer) => {
      return (
        layer.detailUrl &&
        !layer.noDetail &&
        (!layer.authScope || user.scopes.includes(layer.authScope))
      )
    })

export const getPanelLayers = (state) => state.mapLayers.panelLayers?.items || []

// Selector to get the mapLayers from the collections in the redux state
export const getMapPanelLayers = createSelector(getPanelLayers, (panelLayers) =>
  panelLayers.length > 0
    ? panelLayers.reduce((acc, cur) => {
        if (cur.mapLayers) {
          return [...acc, ...cur.mapLayers]
        }
        return cur
      }, [])
    : [],
)

export const selectActivePanelLayers = createSelector(
  [getMapPanelLayers, getMapOverlays],
  (panelLayers, overlays) => {
    const mapLayerIds = overlays.map((mapLayer) => mapLayer.id)

    return panelLayers
      .filter((mapLayer) =>
        [mapLayer.id, ...(mapLayer.legendItems?.map((legendItem) => legendItem.id) || [])]
          .filter((mapLayerId) => Boolean(mapLayerId))
          .some((mapLayerId) => mapLayerIds.includes(mapLayerId)),
      )
      .sort((a, b) => {
        const aId = a.id || a.legendItems[0].id
        const bId = b.id || b.legendItems[0].id
        return mapLayerIds.indexOf(bId) - mapLayerIds.indexOf(aId)
      })
  },
)

export const getActiveMapLayersWithinZoom = createSelector(
  [getMapZoom, selectActivePanelLayers],
  (zoomLevel, activePanelLayers) =>
    activePanelLayers.filter(
      (mapLayer) => zoomLevel >= mapLayer.minZoom && zoomLevel <= mapLayer.maxZoom,
    ),
)

export const selectNotClickableVisibleMapLayers = createSelector(
  [getActiveMapLayersWithinZoom, getMapOverlays],
  (activePanelLayers, overlays) =>
    activePanelLayers
      .map((mapLayer) => [mapLayer, ...mapLayer.legendItems])
      .reduce((accumulator, legendItems) => accumulator.concat(legendItems), [])
      .filter((legendItem) => legendItem.noDetail)
      .filter((legendItem) =>
        overlays.some((overlay) => overlay.id === legendItem.id && overlay.isVisible),
      ),
)

export const getLayers = createSelector(
  [getMapPanelLayers, getActiveMapLayers, getMapZoom],
  (panelLayers, activeMapLayers, zoom) =>
    activeMapLayers.filter((layer) => {
      const matchingPanelLayer = panelLayers.find(
        (panelLayer) =>
          panelLayer.id === layer.id ||
          panelLayer?.legendItems?.some((legendItem) => legendItem.id === layer.id),
      )
      return (
        matchingPanelLayer &&
        zoom <= matchingPanelLayer.maxZoom &&
        zoom >= matchingPanelLayer.minZoom
      )
    }),
)

export default function PanelLayersReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PANEL_ITEMS_REQUEST:
      return { ...state, isLoading: true, error: null }

    case FETCH_PANEL_ITEMS_SUCCESS:
      return { ...state, isLoading: false, items: action.panelLayers }

    case FETCH_PANEL_ITEMS_FAILURE:
      return { ...state, isLoading: false, error: action.error }

    default:
      return state
  }
}

export const fetchPanelLayers = (panelLayers) => ({
  type: FETCH_PANEL_ITEMS_REQUEST,
  panelLayers,
})
