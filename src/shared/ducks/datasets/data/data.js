import paramsRegistry from '../../../../store/params-registry';

const REDUCER_KEY = 'datasetData';
export const DOWNLOAD_DATASET_RESOURCE = `${REDUCER_KEY}/DOWNLOAD_DATASET_RESOURCE`;
export const FETCH_DATASETS_REQUEST = `${REDUCER_KEY}/FETCH_DATASETS_REQUEST`;
export const FETCH_DATASETS_SUCCESS = `${REDUCER_KEY}/FETCH_DATASETS_SUCCESS`;
export const FETCH_DATASETS_FAILURE = `${REDUCER_KEY}/FETCH_DATASETS_FAILURE`;

export const SET_PAGE = `${REDUCER_KEY}/SET_PAGE`;

export const DEFAULT_DATASET = 'dcatd';
export const DEFAULT_VIEW = 'CATALOG';

export { REDUCER_KEY as DATA };

export const initialState = {
  isLoading: false,
  page: 1,
  authError: false,
  result: {
    numberOfRecords: 0
  }
};

export default function reducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(`datasets.${REDUCER_KEY}`, action)
  };
  switch (action.type) {
    case FETCH_DATASETS_REQUEST:
      return {
        ...enrichedState,
        isLoading: true
      };
    case FETCH_DATASETS_SUCCESS:
      return {
        ...enrichedState,
        ...action.payload,
        isLoading: false
      };
    case FETCH_DATASETS_FAILURE:
      return {
        ...enrichedState,
        isLoading: false,
        authError: (action.payload.error === 'Unauthorized'),
        errorMessage: action.payload.error
      };

    case SET_PAGE:
      return {
        ...enrichedState,
        page: action.payload
      };

    default:
      return enrichedState;
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
