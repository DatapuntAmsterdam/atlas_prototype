import { routing } from '../../../app/routes';
import { normalizeCoordinate } from '../../../shared/services/coordinate-reference-system';
import { FETCH_MAP_DETAIL_SUCCESS } from '../detail/constants';
import drawToolConfig from '../../services/draw-tool/draw-tool.config';
import { SET_SELECTION } from '../../../shared/ducks/selection/selection';
import paramsRegistry from '../../../store/params-registry';

const REDUCER_KEY = 'map';
export { REDUCER_KEY as MAP };
export const MAP_BOUNDING_BOX = 'MAP_BOUNDING_BOX';
export const MAP_EMPTY_GEOMETRY = 'MAP_EMPTY_GEOMETRY';
export const MAP_END_DRAWING = 'MAP_END_DRAWING';
export const MAP_PAN = 'MAP_PAN';
export const MAP_START_DRAWING = 'MAP_START_DRAWING';
export const MAP_UPDATE_SHAPE = 'MAP_UPDATE_SHAPE';
export const MAP_ZOOM = 'MAP_ZOOM';
export const MAP_CLEAR = 'MAP_CLEAR';
export const SET_MAP_BASE_LAYER = 'SET_MAP_BASE_LAYER';
export const TOGGLE_MAP_OVERLAY = 'TOGGLE_MAP_OVERLAY';
export const TOGGLE_MAP_OVERLAY_PANORAMA = 'TOGGLE_MAP_OVERLAY_PANORAMA';
export const TOGGLE_MAP_OVERLAY_VISIBILITY = 'TOGGLE_MAP_OVERLAY_VISIBILITY';
export const SET_MAP_CLICK_LOCATION = 'SET_MAP_CLICK_LOCATION';
export const TOGGLE_MAP_PANEL = 'TOGGLE_MAP_PANEL';
export const SET_VIEW = 'SET_VIEW';

export const DEFAULT_LAT = 52.3731081;
export const DEFAULT_LNG = 4.8932945;
export const PANORAMA = 'pano';
export const VIEWS = {
  MAP: 'kaart',
  HOME: 'home'
};

export const initialState = {
  viewCenter: [DEFAULT_LAT, DEFAULT_LNG],
  baseLayer: 'topografie',
  view: VIEWS.HOME,
  zoom: 11,
  overlays: [],
  isLoading: false,
  drawingMode: drawToolConfig.DRAWING_MODE.NONE,
  shapeDistanceTxt: '',
  shapeAreaTxt: '',
  mapPanelActive: true
};

let polygon = {};
let has2Markers;
let moreThan2Markers;
export const isPanoLayer = (layer) => layer.id.startsWith(PANORAMA);

export default function MapReducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };

  switch (action.type) {
    case routing.dataDetail.type:
      return {
        ...enrichedState,
        overlays: enrichedState.overlays ? [...enrichedState.overlays.filter(
          (overlay) => !isPanoLayer(overlay)
        )] : []
      };

    case routing.dataQuerySearch.type:
    case routing.addresses.type:
    case routing.cadastralObjects.type:
    case routing.establishments.type:
      // When opening these pages, close legend, remove pano layer
      return {
        ...enrichedState,
        mapPanelActive: false,
        overlays: enrichedState.overlays ? [...enrichedState.overlays.filter(
          (overlay) => !isPanoLayer(overlay)
        )] : []
      };

    case routing.panorama.type:
      // When opening these pages, close legend
      return {
        ...enrichedState,
        mapPanelActive: false,
        overlays: enrichedState.overlays
      };

    case MAP_PAN:
      return {
        ...enrichedState,
        viewCenter: [
          action.payload.latitude,
          action.payload.longitude
        ]
      };
    case MAP_ZOOM:
      return {
        ...enrichedState,
        zoom: action.payload
      };

    case MAP_BOUNDING_BOX:
      return {
        ...enrichedState,
        boundingBox: action.payload.boundingBox
      };

    case MAP_EMPTY_GEOMETRY:
    case FETCH_MAP_DETAIL_SUCCESS:
      return {
        ...enrichedState,
        geometry: []
      };

    case MAP_UPDATE_SHAPE:
      return {
        ...enrichedState,
        shapeDistanceTxt: action.payload.shapeDistanceTxt,
        shapeAreaTxt: action.payload.shapeAreaTxt
      };

    case MAP_START_DRAWING:
      return {
        ...enrichedState,
        drawingMode: action.payload.drawingMode
      };

    case MAP_END_DRAWING:
      polygon = action.payload && action.payload.polygon;
      has2Markers = polygon && polygon.markers && polygon.markers.length === 2;
      moreThan2Markers = polygon && polygon.markers && polygon.markers.length > 2;

      return {
        ...enrichedState,
        drawingMode: drawToolConfig.DRAWING_MODE.NONE,
        geometry: has2Markers ? polygon.markers : moreThan2Markers ? [] : enrichedState.geometry,
        isLoading: moreThan2Markers ? true : enrichedState.isLoading
      };

    case SET_MAP_BASE_LAYER:
      return {
        ...enrichedState,
        baseLayer: action.payload
      };

    case SET_VIEW:
      return {
        ...enrichedState,
        view: action.payload
      };

    case TOGGLE_MAP_PANEL:
      return {
        ...enrichedState,
        mapPanelActive: !enrichedState.mapPanelActive
      };

    case TOGGLE_MAP_OVERLAY:
      return {
        ...enrichedState,
        overlays: enrichedState.overlays.some(
          (overlay) => !isPanoLayer(overlay) && action.payload.mapLayers.includes(overlay.id)
        ) ? [...enrichedState.overlays.filter(
          (overlay) => !action.payload.mapLayers.includes(overlay.id)
        )] : [...enrichedState.overlays, ...action.payload.mapLayers.map(
          (mapLayerId) => ({ id: mapLayerId, isVisible: true })
        )]
      };

    case TOGGLE_MAP_OVERLAY_PANORAMA:
      return {
        ...enrichedState,
        overlays: [
          { id: action.payload, isVisible: true },
          ...enrichedState.overlays.filter(
            (overlay) => !isPanoLayer(overlay)
          )]
      };

    case TOGGLE_MAP_OVERLAY_VISIBILITY:
      return {
        ...enrichedState,
        overlays: enrichedState.overlays.map((overlay) => ({
          ...overlay,
          isVisible: overlay.id === action.mapLayerId ?
            action.isVisible :
            overlay.isVisible
        }))
      };

    case routing.home.type:
      return {
        ...enrichedState,
        overlays: initialState.overlays,
        drawingMode: initialState.drawingMode,
        shapeDistanceTxt: initialState.shapeDistanceTxt,
        shapeAreaTxt: initialState.shapeAreaTxt
      };

    case MAP_CLEAR:
      return {
        ...enrichedState,
        drawingMode: initialState.drawingMode,
        shapeDistanceTxt: initialState.shapeDistanceTxt,
        shapeAreaTxt: initialState.shapeAreaTxt
      };

    case SET_SELECTION:
      return {
        ...enrichedState,
        drawingMode: initialState.drawingMode,
        shapeDistanceTxt: initialState.shapeDistanceTxt,
        shapeAreaTxt: initialState.shapeAreaTxt
      };

    default:
      return enrichedState;
  }
}

// Actions
export const mapEmptyGeometry = () => ({ type: MAP_EMPTY_GEOMETRY });
export const mapUpdateShape = (payload) => ({ type: MAP_UPDATE_SHAPE, payload });
export const mapStartDrawing = (payload) => ({ type: MAP_START_DRAWING, payload });
export const mapEndDrawing = (payload) => ({ type: MAP_END_DRAWING, payload });
export const mapClear = () => ({ type: MAP_CLEAR });
export const updateZoom = (payload) => ({ type: MAP_ZOOM, payload });
export const toggleMapPanel = () => ({ type: TOGGLE_MAP_PANEL });
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
    tracking: (payload && payload.id && !isPanoLayer(payload)) ? payload : null
  }
});
export const toggleMapOverlayPanorama = (payload) => ({
  type: TOGGLE_MAP_OVERLAY_PANORAMA,
  payload: (payload.year) ? `${PANORAMA}${payload.year}${payload.missionType}` : PANORAMA
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
  }
});
export const updateBoundingBox = (payload) => ({
  type: MAP_BOUNDING_BOX,
  payload
});
