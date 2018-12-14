export const REDUCER_KEY = 'datasetApiSpecification';
export const FETCH_API_SPECIFICATION_REQUEST = `${REDUCER_KEY}/FETCH_API_SPECIFICATION_REQUEST`;
export const FETCH_API_SPECIFICATION_SUCCESS = `${REDUCER_KEY}/FETCH_API_SPECIFICATION_SUCCESS`;
export const FETCH_API_SPECIFICATION_FAILURE = `${REDUCER_KEY}/FETCH_API_SPECIFICATION_FAILURE`;

const initialState = {
  isLoading: false,
  error: null,
  data: {}
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_API_SPECIFICATION_REQUEST:
      return {
        ...state,
        isLoading: true,
        error: null
      };

    case FETCH_API_SPECIFICATION_SUCCESS:
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: null
      };

    case FETCH_API_SPECIFICATION_FAILURE:
      return {
        ...state,
        data: {},
        isLoading: false,
        error: action.payload
      };

    default:
      return state;
  }
}

// Actions
export const fetchApiSpecification = () => ({
  type: FETCH_API_SPECIFICATION_REQUEST
});

export const fetchApiSpecificationSuccess = (payload) => ({
  type: FETCH_API_SPECIFICATION_SUCCESS,
  payload
});

export const fetchApiSpecificationFailure = (payload) => ({
  type: FETCH_API_SPECIFICATION_FAILURE,
  payload
});
