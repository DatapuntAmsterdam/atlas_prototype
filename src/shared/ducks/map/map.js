export const MAP_CLEAR_DRAWING = 'MAP_CLEAR_DRAWING';
export const MAP_EMPTY_GEOMETRY = 'MAP_EMPTY_GEOMETRY';
export const MAP_UPDATE_SHAPE = 'MAP_UPDATE_SHAPE';
export const MAP_START_DRAWING = 'MAP_START_DRAWING';
export const MAP_END_DRAWING = 'MAP_END_DRAWING';

const initialState = {
  viewCenter: [52.3731081, 4.8932945],
  baseLayer: 'topografie',
  zoom: 11,
  overlays: [],
  isLoading: false,
  drawingMode: 'none',
  highlight: true,
  shapeMarkers: 0,
  shapeDistanceTxt: '',
  shapeAreaTxt: ''
};

let polygon = {};
let has2Markers;
let moreThan2Markers;

export default function MapReducer(state = initialState, action) {
  switch (action.type) {
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

    default:
      return state;
  }
}

export const mapClearDrawing = () => ({ type: MAP_CLEAR_DRAWING });
export const mapEmptyGeometry = () => ({ type: MAP_EMPTY_GEOMETRY });
export const mapUpdateShape = (payload) => ({ type: MAP_UPDATE_SHAPE, payload });
export const mapStartDrawing = (payload) => ({ type: MAP_START_DRAWING, payload });
export const mapEndDrawing = (payload) => ({ type: MAP_END_DRAWING, payload });

window.reducers = window.reducers || {};
window.reducers.MapReducer = MapReducer;
