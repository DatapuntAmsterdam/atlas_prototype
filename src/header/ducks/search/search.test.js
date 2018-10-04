import {
  FETCH_DATA_SELECTION,
  FETCH_SEARCH_RESULTS_BY_QUERY,
  fetchDataSelection,
  fetchSearchResultsByQuery
} from './search';

describe('Search actions', () => {
  it('fetchDataSelection', () => {
    expect(fetchDataSelection('query')).toEqual({
      type: FETCH_DATA_SELECTION,
      payload: 'query'
    });
  });

  it('fetchSearchResultsByQuery', () => {
    expect(fetchSearchResultsByQuery('query')).toEqual({
      type: FETCH_SEARCH_RESULTS_BY_QUERY,
      payload: 'query'
    });
  });
});
