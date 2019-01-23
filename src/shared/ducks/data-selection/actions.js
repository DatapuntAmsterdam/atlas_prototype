import {
  CANCEL_DATA_SELECTION,
  END_DATA_SELECTION,
  FETCH_DATA_SELECTION_FAILURE,
  FETCH_DATA_SELECTION_REQUEST,
  FETCH_DATA_SELECTION_SUCCESS,
  DOWNLOAD_DATA_SELECTION,
  RESET_DATA_SELECTION,
  REMOVE_GEOMETRY_FILTER,
  SET_DATASET,
  SET_GEOMETRY_FILTER,
  SET_MARKERS,
  SET_PAGE,
  START_DATA_SELECTION
} from './constants';

export const fetchDataSelection = (payload) => ({ type: FETCH_DATA_SELECTION_REQUEST, payload });
export const setMarkers = (payload) => ({ type: SET_MARKERS, payload });
export const setPage = (payload) => ({ type: SET_PAGE, payload });
export const setDataset = (payload) => ({ type: SET_DATASET, payload });
export const removeGeometryFilter = () => ({ type: REMOVE_GEOMETRY_FILTER });
export const receiveDataSelectionSuccess = (payload) => ({
  type: FETCH_DATA_SELECTION_SUCCESS,
  payload
});
export const receiveDataSelectionFailure = (payload) => ({
  type: FETCH_DATA_SELECTION_FAILURE,
  payload
});
export const downloadDataSelection = (payload) => ({
  type: DOWNLOAD_DATA_SELECTION,
  meta: {
    tracking: payload
  }
});
export const setGeometryFilter = (payload) => ({
  type: SET_GEOMETRY_FILTER,
  payload,
  meta: {
    tracking: true
  }
});
export const resetDrawing = (payload = false) => ({
  type: RESET_DATA_SELECTION,
  payload
});
export const cancelDrawing = () => ({
  type: CANCEL_DATA_SELECTION
});
export const endDataSelection = () => ({
  type: END_DATA_SELECTION
});
export const startDrawing = () => ({
  type: START_DATA_SELECTION
});
