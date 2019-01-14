import {
  FETCH_GEO_SEARCH_RESULTS_FAILURE,
  FETCH_GEO_SEARCH_RESULTS_REQUEST,
  FETCH_GEO_SEARCH_RESULTS_SUCCESS_LIST,
  FETCH_GEO_SEARCH_RESULTS_SUCCESS_PANEL,
  FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST,
  FETCH_QUERY_SEARCH_MORE_RESULTS_SUCCESS,
  FETCH_QUERY_SEARCH_RESULTS_REQUEST,
  FETCH_QUERY_SEARCH_RESULTS_SUCCESS,
  SET_GEO_LOCATION,
  SET_VIEW
} from './constants';

// Action creators
export const fetchMapSearchResultsRequest = (payload, isMap) => ({
  type: FETCH_GEO_SEARCH_RESULTS_REQUEST,
  payload,
  meta: {
    isMap
  }
});
export const fetchMapSearchResultsSuccessPanel = (results, numberOfResults) => ({
  type: FETCH_GEO_SEARCH_RESULTS_SUCCESS_PANEL,
  payload: { results, numberOfResults }
});

export const fetchMapSearchResultsSuccessList = (results, numberOfResults) => ({
  type: FETCH_GEO_SEARCH_RESULTS_SUCCESS_LIST,
  payload: { results, numberOfResults }
});

export const fetchMapSearchResultsFailure = (payload) => ({
  type: FETCH_GEO_SEARCH_RESULTS_FAILURE,
  payload
});

export const showSearchResults = (results, query, numberOfResults) => ({
  type: FETCH_QUERY_SEARCH_RESULTS_SUCCESS,
  payload: { results, numberOfResults },
  meta: {
    tracking: {
      query,
      numberOfResults
    }
  }
});

export const fetchSearchResultsByQuery = (payload, loadMore = false) => ({
  type: FETCH_QUERY_SEARCH_RESULTS_REQUEST,
  payload,
  meta: {
    loadMore
  }
});

export const fetchMoreResults = () => ({
  type: FETCH_QUERY_SEARCH_MORE_RESULTS_REQUEST
});

export const fetchMoreResultsSuccess = (payload) => ({
  type: FETCH_QUERY_SEARCH_MORE_RESULTS_SUCCESS,
  payload
});

export const setView = (payload) => ({
  type: SET_VIEW,
  payload
});

export const setGeoLocation = (payload) => ({
  type: SET_GEO_LOCATION,
  payload
});
