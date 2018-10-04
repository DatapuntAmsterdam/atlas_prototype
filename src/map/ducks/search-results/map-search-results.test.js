import reducer, {
  FETCH_MAP_SEARCH_RESULTS_FAILURE,
  FETCH_MAP_SEARCH_RESULTS_SUCCESS,
  getMapResultsByLocation,
  getMapSearchResults,
  getSearch,
  isSearchActive
} from './map-search-results';

import { getSearchMarker, selectLatestMapSearchResults } from '../map/map-selectors';

describe('mapSearch reducer', () => {
  it('sets the initial state', () => {
    expect(reducer(undefined, { type: 'UNKOWN' })).toMatchSnapshot();
  });

  it('handles search results request', () => {
    const action = getMapSearchResults({
      latitude: 52.3637006,
      longitude: 4.7943446
    }, { name: 'does not matter' });
    expect(reducer({}, action)).toMatchSnapshot();
  });

  it('handles search results success', () => {
    const action = {
      type: FETCH_MAP_SEARCH_RESULTS_SUCCESS,
      location: {
        latitude: 52.3637006,
        longitude: 4.7943446
      },
      mapSearchResults: [{ foo: 'bar' }]
    };
    expect(reducer({}, action)).toMatchSnapshot();
  });

  it('should handle search failure', () => {
    expect(reducer({}, {
      type: FETCH_MAP_SEARCH_RESULTS_FAILURE
    })).toEqual({
      isLoading: false
    });
  });
});

describe('mapSearch Selectors', () => {
  describe('getSearch', () => {
    it('should return state.search as a object', () => {
      const mockParameters = { search: {} };
      expect(getSearch(mockParameters)).toEqual(mockParameters.search);
    });

    it('should return state.search undefined', () => {
      const mockParameters = {};
      expect(getSearch(mockParameters)).toEqual();
    });
  });

  describe('getMapResultsByLocation', () => {
    it('should return state.mapSearchResultsByLocation as a object', () => {
      const mockParameters = {
        mapSearchResultsByLocation: {}
      };
      const selected = getMapResultsByLocation(mockParameters);
      expect(selected).toBe(mockParameters.mapSearchResultsByLocation);
    });

    it('should return state.search.location as undefined', () => {
      const mockParameters = {};
      const selected = getMapResultsByLocation(mockParameters);
      expect(selected).toEqual();
    });
  });

  describe('isSearchActive', () => {
    it('should return state.search.location as a number: > 0', () => {
      const mockParameters = {
        location: [10, 10]
      };
      const selected = isSearchActive.resultFunc(mockParameters);
      expect(selected).toEqual(mockParameters.location.length);
    });

    it('should return state.search.location as a number: 0', () => {
      const mockParameters = {
        location: []
      };
      const selected = isSearchActive.resultFunc(mockParameters);
      expect(selected).toEqual(mockParameters.location.length);
    });
  });

  describe('getSearchMarker', () => {
    it('should return an array of searchMarkers', () => {
      const getShortSelectedLocationMock = { latitude: 10, longitude: 10 };
      const selected = getSearchMarker.resultFunc(getShortSelectedLocationMock);
      expect(selected).toEqual([{ position: [10, 10], type: 'geoSearchType' }]);
    });

    it('should return an empty array', () => {
      const isSearchActiveMock = 0;
      const getSearchMock = {
        location: []
      };
      const selected = getSearchMarker.resultFunc(isSearchActiveMock, getSearchMock);
      expect(selected).toEqual([]);
    });
  });

  describe('selectLatestMapSearchResults', () => {
    it('should return an array of results', () => {
      const getMapResultsByLocationMock = {
        '123,456': [
          { id: 'resultMock1' }
        ],
        '789,1011': [
          { id: 'resultMock2' }
        ]
      };
      const getLocationIdMock = '123,456';
      const selected = selectLatestMapSearchResults.resultFunc(
        getLocationIdMock, getMapResultsByLocationMock
      );
      expect(selected).toBe(getMapResultsByLocationMock['123,456']);
    });

    it('should return undefined', () => {
      const getMapResultsByLocationMock = {};
      const getSearchMock = {
        location: [10, 10]
      };
      const selected = selectLatestMapSearchResults.resultFunc(
        getSearchMock, getMapResultsByLocationMock
      );
      expect(selected).toEqual();
    });

    it('should return undefined', () => {
      const getMapResultsByLocationMock = {
        '10,10': [
          { id: 'resultMock' }
        ]
      };
      const getSearchMock = {
        location: [20, 20]
      };
      const selected = selectLatestMapSearchResults.resultFunc(
        getSearchMock, getMapResultsByLocationMock
      );
      expect(selected).toEqual();
    });
  });
});
