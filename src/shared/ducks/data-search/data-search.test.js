import {
  fetchMapSearchResultsFailure,
  fetchMapSearchResultsRequest,
  fetchMapSearchResultsSuccessPanel
} from './actions';
import { REDUCER_KEY } from './constants';
import reducer from './reducer';
import { getMapPanelResults, getSearchQuery } from './selectors';

describe('mapSearch reducer', () => {
  it('sets the initial state', () => {
    expect(reducer(undefined, { type: 'UNKOWN' })).toMatchSnapshot();
  });

  it('handles search results request', () => {
    const action = fetchMapSearchResultsRequest({
      latitude: 52.3637006,
      longitude: 4.7943446
    });
    expect(reducer({}, action)).toMatchSnapshot();
  });

  it('handles search results success', () => {
    const action = fetchMapSearchResultsSuccessPanel([{ foo: 'bar' }]);
    expect(reducer({}, action)).toMatchSnapshot();
  });

  it('should handle search failure', () => {
    expect(reducer({}, fetchMapSearchResultsFailure('error'))).toEqual({
      isLoading: false,
      error: 'error'
    });
  });
});

describe('data-search selectors', () => {
  it('getSearchQuery', () => {
    const state = {
      [REDUCER_KEY]: {
        query: 'foo'
      }
    };
    expect(getSearchQuery(state)).toEqual(state[REDUCER_KEY].query);
  });

  describe('getMapPanelResults', () => {
    it('should return state.resultsMap as a array', () => {
      const state = {
        [REDUCER_KEY]: {
          resultsMapPanel: []
        }
      };
      expect(getMapPanelResults(state)).toEqual(state[REDUCER_KEY].resultsMapPanel);
    });
  });
});
