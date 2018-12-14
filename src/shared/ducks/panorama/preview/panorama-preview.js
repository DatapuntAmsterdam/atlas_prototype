import { createSelector } from 'reselect';

export const REDUCER_KEY = 'panoramaPreview';

export const FETCH_PANORAMA_PREVIEW_REQUEST = `${REDUCER_KEY}/FETCH_PANORAMA_PREVIEW_REQUEST`;
const FETCH_PANORAMA_PREVIEW_SUCCESS = `${REDUCER_KEY}/FETCH_PANORAMA_PREVIEW_SUCCESS`;
const FETCH_PANORAMA_PREVIEW_FAILURE = `${REDUCER_KEY}/FETCH_PANORAMA_PREVIEW_FAILURE`;

const initialState = {
  isLoading: false,
  error: undefined,
  preview: undefined
};

export default function PanoPreviewReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_PANORAMA_PREVIEW_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: undefined,
        preview: undefined
      };

    case FETCH_PANORAMA_PREVIEW_SUCCESS:
      return {
        ...state,
        isLoading: false,
        preview: action.payload
      };

    case FETCH_PANORAMA_PREVIEW_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
}

// action creators
export const fetchPanoramaPreview = (location) => ({
  type: FETCH_PANORAMA_PREVIEW_REQUEST,
  payload: location
});

export const fetchPanoramaPreviewSuccess = (payload) => ({
  type: FETCH_PANORAMA_PREVIEW_SUCCESS,
  payload
});

export const fetchPanoramaPreviewFailure = (error) => ({
  type: FETCH_PANORAMA_PREVIEW_FAILURE,
  payload: error
});

// selectors
const getPanoramaPreviewState = (state) => state[REDUCER_KEY];
const getStateOfKey = (key) =>
  (state) => createSelector(getPanoramaPreviewState, (data) => (data[key]))(state);

export const getPanoramaPreview = getStateOfKey('preview');
export const isPanoramaPreviewLoading = getStateOfKey('isLoading');
