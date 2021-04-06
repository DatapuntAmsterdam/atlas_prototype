import {
  FETCH_GEO_SEARCH_RESULTS_FAILURE,
  FETCH_GEO_SEARCH_RESULTS_REQUEST,
  FETCH_GEO_SEARCH_RESULTS_SUCCESS_LIST,
  FETCH_GEO_SEARCH_RESULTS_SUCCESS_PANEL,
  initialState,
  REDUCER_KEY,
} from './constants'
import paramsRegistry from '../../../store/params-registry'

export { REDUCER_KEY as DATA_SEARCH_REDUCER }

export default function reducer(state = initialState, action) {
  const enrichedState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  }

  switch (action.type) {
    case FETCH_GEO_SEARCH_RESULTS_REQUEST:
      return {
        ...enrichedState,
        isLoading: true,
        geoSearch: action.payload,
      }

    case FETCH_GEO_SEARCH_RESULTS_SUCCESS_PANEL: {
      const { results, numberOfResults } = action.payload
      return {
        ...enrichedState,
        isLoading: false,
        numberOfResults,
        resultsMapPanel: results,
      }
    }

    case FETCH_GEO_SEARCH_RESULTS_SUCCESS_LIST: {
      const { results, numberOfResults } = action.payload
      return {
        ...enrichedState,
        isLoading: false,
        numberOfResults,
        resultsMap: results,
      }
    }

    case FETCH_GEO_SEARCH_RESULTS_FAILURE:
      return {
        ...enrichedState,
        isLoading: false,
        error: action.payload,
      }

    default:
      return enrichedState
  }
}
