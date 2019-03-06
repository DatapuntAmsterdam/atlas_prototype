import { FETCH_MAP_DETAIL_SUCCESS } from '../detail/constants';
import drawToolConfig from '../../services/draw-tool/draw-tool.config';
import { SET_SELECTION } from '../../../shared/ducks/selection/selection';
import paramsRegistry from '../../../store/params-registry';

import {
  MAP_EMPTY_GEOMETRY, MAP_UPDATE_SHAPE, MAP_SET_DRAWING_MODE, MAP_END_DRAWING,
  MAP_CLEAR, MAP_ZOOM, TOGGLE_MAP_PANEL, CLOSE_MAP_PANEL, SET_MAP_BASE_LAYER,
  TOGGLE_MAP_OVERLAY, TOGGLE_MAP_OVERLAY_PANORAMA, TOGGLE_MAP_OVERLAY_VISIBILITY,
  MAP_PAN, MAP_BOUNDING_BOX, MAP_LOADING, PANORAMA, initialState, REDUCER_KEY
} from './constants';


let polygon = {};
let has2Markers;
let moreThan2Markers;
export const isPanoLayer = (layer) => layer.id && layer.id.startsWith(PANORAMA);

export default function MapReducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action)
  };

  switch (action.type) {
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
        shapeMarkers: action.payload.shapeMarkers,
        shapeDistanceTxt: action.payload.shapeDistanceTxt,
        shapeAreaTxt: action.payload.shapeAreaTxt
      };

    case MAP_SET_DRAWING_MODE:
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
        isLoading: true
      };

    case SET_MAP_BASE_LAYER:
      return {
        ...enrichedState,
        baseLayer: action.payload
      };

    case TOGGLE_MAP_PANEL:
      return {
        ...enrichedState,
        mapPanelActive: !enrichedState.mapPanelActive
      };

    case CLOSE_MAP_PANEL:
      return {
        ...enrichedState,
        mapPanelActive: false
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

    case MAP_CLEAR:
      return {
        ...enrichedState,
        drawingMode: initialState.drawingMode,
        shapeMarkers: initialState.shapeMarkers,
        shapeDistanceTxt: initialState.shapeDistanceTxt,
        shapeAreaTxt: initialState.shapeAreaTxt
      };

    case SET_SELECTION:
      return {
        ...enrichedState,
        drawingMode: initialState.drawingMode,
        shapeMarkers: initialState.shapeMarkers,
        shapeDistanceTxt: initialState.shapeDistanceTxt,
        shapeAreaTxt: initialState.shapeAreaTxt
      };

    case MAP_LOADING:
      return {
        ...enrichedState,
        isLoading: action.payload
      };

    default:
      return enrichedState;
  }
}

