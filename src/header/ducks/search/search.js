export const FETCH_DATA_SELECTION = 'FETCH_DATA_SELECTION';
export const FETCH_SEARCH_RESULTS_BY_QUERY = 'FETCH_SEARCH_RESULTS_BY_QUERY';

export const fetchDataSelection = (query) => ({
  type: FETCH_DATA_SELECTION,
  payload: query
});

export const fetchSearchResultsByQuery = (query) => ({
  type: FETCH_SEARCH_RESULTS_BY_QUERY,
  payload: query
});
