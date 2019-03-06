import { getLabelObjectByTags } from '../../../panorama/ducks/selectors';
import { normalizeCoordinate } from '../../../shared/services/coordinate-reference-system';
import {
  MAP_EMPTY_GEOMETRY, MAP_UPDATE_SHAPE, MAP_SET_DRAWING_MODE, MAP_END_DRAWING,
  MAP_CLEAR, MAP_ZOOM, TOGGLE_MAP_PANEL, CLOSE_MAP_PANEL, SET_MAP_BASE_LAYER,
  TOGGLE_MAP_OVERLAY, TOGGLE_MAP_OVERLAY_PANORAMA, TOGGLE_MAP_OVERLAY_VISIBILITY,
  MAP_PAN, SET_MAP_CLICK_LOCATION, MAP_BOUNDING_BOX, MAP_LOADING
} from './constants';

// Actions
export const mapEmptyGeometry = () => ({ type: MAP_EMPTY_GEOMETRY });
export const mapUpdateShape = (payload) => ({ type: MAP_UPDATE_SHAPE, payload });
export const mapSetDrawingMode = (payload) => ({
  type: MAP_SET_DRAWING_MODE,
  payload,
  meta: {
    tracking: payload.drawingMode
  }
});
export const mapEndDrawing = (payload) => ({ type: MAP_END_DRAWING, payload });
export const mapClear = () => ({ type: MAP_CLEAR });
export const updateZoom = (payload) => ({ type: MAP_ZOOM, payload });
export const toggleMapPanel = () => ({ type: TOGGLE_MAP_PANEL });
export const closeMapPanel = () => ({ type: CLOSE_MAP_PANEL });
export const setMapBaseLayer = (payload) => ({
  type: SET_MAP_BASE_LAYER,
  payload,
  meta: {
    tracking: payload
  }
});
export const toggleMapOverlay = (payload) => ({
  type: TOGGLE_MAP_OVERLAY,
  payload: {
    mapLayers: (payload.id) ? [payload.id] : payload.legendItems.map((overlay) => overlay.id)
  },
  meta: {
    tracking: payload
  }
});

export const toggleMapOverlayPanorama = (tags) => ({
  type: TOGGLE_MAP_OVERLAY_PANORAMA,
  payload: getLabelObjectByTags(tags).layerId
});

export const toggleMapOverlayVisibility = (mapLayerId, isVisible) => ({
  type: TOGGLE_MAP_OVERLAY_VISIBILITY,
  mapLayerId,
  isVisible: !isVisible
});
export const updatePan = (payload) => ({
  type: MAP_PAN,
  payload: {
    latitude: normalizeCoordinate(payload.lat, 7),
    longitude: normalizeCoordinate(payload.lng, 7)
  }
});
export const setSelectedLocation = (payload) => ({
  type: SET_MAP_CLICK_LOCATION,
  payload: {
    location: {
      latitude: normalizeCoordinate(payload.latlng.lat, 7),
      longitude: normalizeCoordinate(payload.latlng.lng, 7)
    }
  },
  meta: {
    tracking: true
  }
});
export const updateBoundingBox = (payload) => ({
  type: MAP_BOUNDING_BOX,
  payload
});

export const mapLoadingAction = (payload) => ({ type: MAP_LOADING, payload });
