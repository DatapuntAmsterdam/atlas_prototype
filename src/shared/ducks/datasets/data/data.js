import { routing } from '../../../../app/routes';

export const REDUCER_KEY = 'datasetData';
export const DOWNLOAD_DATASET_RESOURCE = `${REDUCER_KEY}/DOWNLOAD_DATASET_RESOURCE`;
export const FETCH_DATASETS_REQUEST = `${REDUCER_KEY}/FETCH_DATASETS_REQUEST`;
export const FETCH_DATASETS_SUCCESS = `${REDUCER_KEY}/FETCH_DATASETS_SUCCESS`;
export const FETCH_DATASETS_FAILURE = `${REDUCER_KEY}/FETCH_DATASETS_FAILURE`;

export const SET_PAGE = `${REDUCER_KEY}/SET_PAGE`;

export const DEFAULT_DATASET = 'dcatd';
export const DEFAULT_VIEW = 'CATALOG';

export const initialState = {
  isLoading: false,
  page: 1,
  authError: false,
  result: {
    numberOfRecords: 0
  }
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case routing.datasets.type: {
      const { page } = action.meta.query || {};
      return {
        ...state,
        page: parseInt(page, 0) || initialState.page
      };
    }
    case FETCH_DATASETS_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case FETCH_DATASETS_SUCCESS:
      return {
        ...state,
        ...action.payload,
        isLoading: false
      };
    case FETCH_DATASETS_FAILURE:
      return {
        ...state,
        isLoading: false,
        authError: (action.payload.error === 'Unauthorized'),
        errorMessage: action.payload.error
      };

    case SET_PAGE:
      return {
        ...state,
        page: action.payload
      };

    default:
      return state;
  }
}

// Actions
export const downloadDatasetResource = (payload) => ({
  type: DOWNLOAD_DATASET_RESOURCE,
  meta: {
    tracking: payload
  }
});

export const fetchDatasets = (payload) => ({
  type: FETCH_DATASETS_REQUEST,
  payload
});

export const receiveDatasetsSuccess = (payload) => ({
  type: FETCH_DATASETS_SUCCESS,
  payload
});

export const receiveDatasetsFailure = (payload) => ({
  type: FETCH_DATASETS_FAILURE,
  payload
});

export const setPage = (payload) => ({ type: SET_PAGE, payload });
