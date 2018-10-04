import { routing } from '../../../app/routes';

export const MAP_ADD_PANO_OVERLAY = 'MAP_ADD_PANO_OVERLAY';
export const MAP_BOUNDING_BOX = 'MAP_BOUNDING_BOX';
export const MAP_BOUNDING_BOX_SILENT = 'MAP_BOUNDING_BOX_SILENT';
export const MAP_CLEAR_DRAWING = 'MAP_CLEAR_DRAWING';
export const MAP_EMPTY_GEOMETRY = 'MAP_EMPTY_GEOMETRY';
export const MAP_END_DRAWING = 'MAP_END_DRAWING';
export const MAP_PAN = 'MAP_PAN';
export const MAP_PAN_SILENT = 'MAP_PAN_SILENT';
export const MAP_REMOVE_PANO_OVERLAY = 'MAP_REMOVE_PANO_OVERLAY';
export const MAP_START_DRAWING = 'MAP_START_DRAWING';
export const MAP_UPDATE_SHAPE = 'MAP_UPDATE_SHAPE';
export const MAP_ZOOM = 'MAP_ZOOM';
export const MAP_ZOOM_SILENT = 'MAP_ZOOM_SILENT';
export const MAP_CLEAR = 'MAP_CLEAR';
export const SET_MAP_BASE_LAYER = 'SET_MAP_BASE_LAYER';
export const TOGGLE_MAP_OVERLAY = 'TOGGLE_MAP_OVERLAY';
export const TOGGLE_MAP_OVERLAY_VISIBILITY = 'TOGGLE_MAP_OVERLAY_VISIBILITY';
export const SET_MAP_CLICK_LOCATION = 'SET_MAP_CLICK_LOCATION';
export const UPDATE_MAP = 'UPDATE_MAP';

const initialState = {
  viewCenter: [52.3731081, 4.8932945],
  baseLayer: 'topografie',
  zoom: 11,
  overlays: [],
  isLoading: false,
  drawingMode: 'none',
  shapeMarkers: 0,
  shapeDistanceTxt: '',
  shapeAreaTxt: '',
  selectedLocation: null
};

let polygon = {};
let has2Markers;
let moreThan2Markers;

const getNewLayer = (straatbeeld) => (
  straatbeeld && straatbeeld.history
    ? `pano${straatbeeld.history}`
    : 'pano'
);

const overlayExists = (state, newLayer) => (
  state.map && state.map.overlays.filter((overlay) =>
    overlay.id === newLayer).length === 1
);

export default function MapReducer(state = initialState, action) {
  switch (action.type) {
    case routing.map.type: {
      const { lat, lng, zoom, selectedLocation } = action.meta.query || {};
      return {
        ...state,
        viewCenter: [
          parseFloat(lat) || initialState.viewCenter[0],
          parseFloat(lng) || initialState.viewCenter[1]
        ],
        zoom: parseFloat(zoom) || initialState.zoom,
        selectedLocation
      };
    }

    case MAP_BOUNDING_BOX:
    case MAP_BOUNDING_BOX_SILENT:
      return {
        ...state,
        boundingBox: action.payload.boundingBox
      };

    case MAP_CLEAR_DRAWING:
      return {
        ...state,
        geometry: []
      };

    case MAP_EMPTY_GEOMETRY:
      return {
        ...state,
        geometry: []
      };

    case MAP_UPDATE_SHAPE:
      return {
        ...state,
        shapeMarkers: action.payload.shapeMarkers,
        shapeDistanceTxt: action.payload.shapeDistanceTxt,
        shapeAreaTxt: action.payload.shapeAreaTxt
      };

    case MAP_START_DRAWING:
      return {
        ...state,
        drawingMode: action.payload.drawingMode
      };

    case MAP_END_DRAWING:
      polygon = action.payload && action.payload.polygon;
      has2Markers = polygon && polygon.markers && polygon.markers.length === 2;
      moreThan2Markers = polygon && polygon.markers && polygon.markers.length > 2;

      return {
        ...state,
        drawingMode: 'none',
        geometry: has2Markers ? polygon.markers : moreThan2Markers ? [] : state.geometry,
        isLoading: moreThan2Markers ? true : state.isLoading
      };

    case SET_MAP_BASE_LAYER:
      return {
        ...state,
        baseLayer: action.payload
      };

    case MAP_ADD_PANO_OVERLAY: //eslint-disable-line
      const newLayer = getNewLayer(action.payload);
      return overlayExists(state, newLayer) ? state : {
        ...state,
        overlays: [
          ...(state.overlays.filter((overlay) =>
              !overlay.id.startsWith('pano'))
          ),
          { id: newLayer, isVisible: true }
        ]
      };

    case MAP_REMOVE_PANO_OVERLAY: //eslint-disable-line
      // Remove all active 'pano' layers
      const overlays = state && state.overlays
                                     .filter((overlay) => !overlay.id.startsWith('pano'));

      return state && overlays.length === state.overlays.length ? state : {
        ...state,
        overlays
      };

    case TOGGLE_MAP_OVERLAY:
      return {
        ...state,
        overlays: state.overlays.some((overlay) => overlay.id === action.mapLayerId) ?
          [...state.overlays.filter((overlay) => overlay.id !== action.mapLayerId)] :
          [...state.overlays, { id: action.mapLayerId, isVisible: true }]
      };

    case TOGGLE_MAP_OVERLAY_VISIBILITY:
      return {
        ...state,
        overlays: state.overlays.map((overlay) => ({
          ...overlay,
          isVisible: overlay.id !== action.mapLayerId ? overlay.isVisible :
            (action.show !== undefined ? action.show : !overlay.isVisible)
        }))
      };

    case MAP_CLEAR:
      return initialState;

    default:
      return state;
  }
}

// Actions
export const mapClearDrawing = () => ({ type: MAP_CLEAR_DRAWING });
export const mapEmptyGeometry = () => ({ type: MAP_EMPTY_GEOMETRY });
export const mapUpdateShape = (payload) => ({ type: MAP_UPDATE_SHAPE, payload });
export const mapStartDrawing = (payload) => ({ type: MAP_START_DRAWING, payload });
export const mapEndDrawing = (payload) => ({ type: MAP_END_DRAWING, payload });
export const mapClear = () => ({ type: MAP_CLEAR });
export const setMapBaseLayer = (payload) => ({ type: SET_MAP_BASE_LAYER, payload });
export const toggleMapOverlay = (mapLayerId) => ({ type: TOGGLE_MAP_OVERLAY, mapLayerId });
export const toggleMapOverlayVisibility = (mapLayerId, show) => ({
  type: TOGGLE_MAP_OVERLAY_VISIBILITY,
  mapLayerId,
  show
});
export const updateZoom = (payload) =>
  ({
    type: UPDATE_MAP,
    payload: {
      query: {
        zoom: payload.zoom,
        lat: payload.center.lat,
        lng: payload.center.lng
      }
    }
  });
export const updatePan = (payload) =>
  ({
    type: UPDATE_MAP,
    payload: {
      query: {
        lat: payload.center.lat,
        lng: payload.center.lng
      }
    }
  });
export const setSelectedLocation = (payload) => ({
  type: SET_MAP_CLICK_LOCATION,
  location: {
    latitude: payload.latlng.lat,
    longitude: payload.latlng.lng
  }
});
export const clearSelectedLocation = () => ({
  type: UPDATE_MAP,
  payload: {
    query: {
      selectedLocation: null
    }
  }
});
export const updateBoundingBox = (payload, isDrawingActive) =>
  ({
    type: isDrawingActive ? MAP_BOUNDING_BOX_SILENT : MAP_BOUNDING_BOX,
    payload
  });
