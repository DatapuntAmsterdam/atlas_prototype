import {
  FETCH_MAP_DETAIL_FAILURE,
  FETCH_MAP_DETAIL_REQUEST,
  FETCH_MAP_DETAIL_SUCCESS,
  initialState
} from './constants';


export default function MapDetailReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_MAP_DETAIL_REQUEST:
      return {
        ...state,
        currentEndpoint: action.payload,
        isLoading: true
      };

    case FETCH_MAP_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: false,
        byEndpoint: {
          ...state.byEndpoint,
          [action.endpoint]: action.mapDetail
        }
      };

    case FETCH_MAP_DETAIL_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: action.error
      };

    default:
      return state;
  }
}
