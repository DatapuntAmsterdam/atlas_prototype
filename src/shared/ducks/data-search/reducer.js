import {
  FETCH_MAP_SEARCH_RESULTS_FAILURE,
  FETCH_MAP_SEARCH_RESULTS_REQUEST,
  FETCH_MAP_SEARCH_RESULTS_SUCCESS_LIST,
  FETCH_MAP_SEARCH_RESULTS_SUCCESS_PANEL,
  FETCH_QUERY_SEARCH_MORE_RESULTS_SUCCESS,
  FETCH_QUERY_SEARCH_RESULTS_FAILURE,
  FETCH_QUERY_SEARCH_RESULTS_REQUEST,
  FETCH_QUERY_SEARCH_RESULTS_SUCCESS,
  initialState,
  REDUCER_KEY,
  SET_GEO_LOCATION,
  SET_QUERY_CATEGORY
} from './constants';
import { getStateFromQuery } from '../../../store/query-synchronization';
import urlParams from './query';
import { routing } from '../../../app/routes';

export { REDUCER_KEY };

export default function reducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...getStateFromQuery(urlParams, action)
  };

  switch (action.type) {
    case routing.dataSearchCategory.type:
      return {
        ...enrichedState,
        category: action.payload.category
      };
    case FETCH_QUERY_SEARCH_RESULTS_REQUEST:
      return {
        ...initialState,
        isLoading: true,
        query: action.payload
      };

    case FETCH_QUERY_SEARCH_RESULTS_SUCCESS: {
      const { results, numberOfResults } = action.payload;
      return {
        ...enrichedState,
        isLoading: false,
        numberOfResults,
        resultsQuery: results
      };
    }

    case FETCH_QUERY_SEARCH_MORE_RESULTS_SUCCESS: {
      return {
        ...enrichedState,
        isLoading: false,
        numberOfResults: 999,
        resultsQuery: [{
          ...state.resultsQuery[0],
          ...action.payload[0]
        }]
      };
    }

    case FETCH_MAP_SEARCH_RESULTS_REQUEST:
      return {
        ...initialState,
        isLoading: true,
        geoSearch: action.payload
      };

    case FETCH_MAP_SEARCH_RESULTS_SUCCESS_PANEL: {
      const { results, numberOfResults } = action.payload;
      return {
        ...enrichedState,
        isLoading: false,
        numberOfResults,
        resultsMapPanel: results
      };
    }

    case FETCH_MAP_SEARCH_RESULTS_SUCCESS_LIST: {
      const { results, numberOfResults } = action.payload;
      return {
        ...enrichedState,
        isLoading: false,
        numberOfResults,
        resultsMap: results
      };
    }

    case FETCH_QUERY_SEARCH_RESULTS_FAILURE:
    case FETCH_MAP_SEARCH_RESULTS_FAILURE:
      return {
        ...enrichedState,
        isLoading: false,
        error: action.payload
      };

    case SET_QUERY_CATEGORY:
      return {
        ...enrichedState,
        category: action.payload
      };

    case SET_GEO_LOCATION:
      return {
        ...enrichedState,
        geoSearch: action.payload
      };

    default:
      return enrichedState;
  }
}
