import {
  CANCEL_DATA_SELECTION,
  END_DATA_SELECTION,
  RESET_DATA_SELECTION,
  REMOVE_GEOMETRY_FILTER,
  SET_GEOMETRY_FILTER,
  SET_PAGE,
  START_DATA_SELECTION,
  FETCH_MARKERS_REQUEST,
  FETCH_MARKERS_SUCCESS,
  FETCH_MARKERS_FAILURE,
} from './constants'

export const fetchMarkersRequest = () => ({ type: FETCH_MARKERS_REQUEST })
export const fetchMarkersSuccess = (payload) => ({
  type: FETCH_MARKERS_SUCCESS,
  payload,
})
export const fetchMarkersFailure = (payload) => ({
  type: FETCH_MARKERS_FAILURE,
  payload,
  error: true,
})

export const setPage = (payload) => ({ type: SET_PAGE, payload })
export const removeGeometryFilter = () => ({ type: REMOVE_GEOMETRY_FILTER })

export const setGeometryFilter = (payload) => ({
  type: SET_GEOMETRY_FILTER,
  payload,
  meta: {
    tracking: true,
  },
})
export const resetDrawing = () => ({
  type: RESET_DATA_SELECTION,
})
export const cancelDrawing = () => ({
  type: CANCEL_DATA_SELECTION,
})
export const endDataSelection = () => ({
  type: END_DATA_SELECTION,
  meta: {
    tracking: true,
  },
})
export const startDrawing = () => ({
  type: START_DATA_SELECTION,
})
