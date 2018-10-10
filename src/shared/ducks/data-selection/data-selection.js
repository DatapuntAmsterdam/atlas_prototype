export const SET_DATA_SELECTION_GEOMETRY_FILTER = 'SET_DATA_SELECTION_GEOMETRY_FILTER';
export const RESET_DATA_SELECTION_GEOMETRY_FILTER = 'RESET_DATA_SELECTION_GEOMETRY_FILTER';

const initialState = {
  markers: [], // eg: [[52.1, 4.1], [52.2, 4.0]],
  geometryFilter: {
    markers: []
  },
  isLoading: true
  // page: 1,
  // isFullscreen: true,
};
let geometryFilter = {};

export default function DataSelectionReducer(state = initialState, action) {
  switch (action.type) {
    case SET_DATA_SELECTION_GEOMETRY_FILTER:
      // Todo: posible bug: if action.payload is undefined, geometryFilter = {}
      geometryFilter = { ...action.payload } || { markers: [] };
      return {
        ...state,
        geometryFilter,
        page: 1,
        isFullscreen: false,
        isLoading: true,
        // No markers, the data selection goes back to its default state of
        // showing all data => make sure it will not trigger a url state
        // change
        reset: geometryFilter.markers.length === 0
      };

    case RESET_DATA_SELECTION_GEOMETRY_FILTER:
      geometryFilter = action.payload.polygon || { markers: [] };
      if ((action.payload.drawingMode !== 'edit') &&
        state &&
        state.geometryFilter &&
        state.geometryFilter.markers &&
        state.geometryFilter.markers.length > 0) {
        return {
          ...state,
          geometryFilter,
          page: 1,
          isFullscreen: false,
          isLoading: true,
          markers: [],
          // No markers, the data selection goes back to its default state of
          // showing all data => make sure it will not trigger a url state
          // change
          reset: geometryFilter.markers.length === 0
        };
      }
      return state;

    default:
      return state;
  }
}

export const setDataSelectionGeometryFilter = (payload) =>
  ({ type: SET_DATA_SELECTION_GEOMETRY_FILTER, payload });
export const resetDataSelectionGeometryFilter = (payload) =>
    ({ type: RESET_DATA_SELECTION_GEOMETRY_FILTER, payload });
