import ACTIONS, { FETCH_SEARCH_RESULTS_BY_LOCATION } from '../../shared/actions';
import searchReducers from './search-reducers';

describe('The search-reducers', () => {
  const defaultState = {
    map: {
      baseLayer: 'topografie',
      overlays: [],
      viewCenter: [52.3719, 4.9012],
      zoom: 9,
      isLoading: false
    },
    search: null,
    page: {
      name: 'home'
    },
    detail: null,
    straatbeeld: null,
    dataSelection: null,
    ui: {
      isMapFullscreen: false,
      isMapPanelVisible: false,
      isPrintMode: false
    }
  };

  describe('FETCH_SEARCH_RESULTS_BY_QUERY', () => {
    it('sets the search query and resets the search location and active category', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: null,
          location: [12.345, 6.789],
          category: 'adres',
          numberOfResults: 23
        }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, 'linnaeus');

      expect(output.search.isLoading)
        .toBe(true);
      expect(output.search.query)
        .toBe('linnaeus');
      expect(output.search.location)
        .toBeNull();
      expect(output.search.category)
        .toBeNull();
      expect(output.search.numberOfResults)
        .toBeNull();
    });

    it('sets query to null on empty string payload', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'xyz',
          location: [12.345, 6.789],
          category: 'adres',
          numberOfResults: 23
        }
      };

      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, '');

      expect(output.search.query)
        .toBe(null);
    });

    it('sets query isFullscreen to true', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'xyz',
          location: [12.345, 6.789],
          category: 'adres',
          numberOfResults: 23
        }
      };
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, '');

      expect(output.search.isFullscreen)
        .toBe(true);
    });

    it('hides the layer selection, page, detail, straatbeeld and dataSelection', () => {
      const inputState = {
        ...defaultState,
        ui: {
          ...defaultState.ui,
          isMapPanelVisible: true
        },
        page: {
          ...defaultState.page,
          name: 'somePage',
          type: 'someType'
        },
        detail: { some: 'object' },
        straatbeeld: null,
        dataSelection: {
          ...defaultState.dataSelection,
          some: 'object'
        }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, 'linnaeus');

      expect(output.ui.isMapPanelVisible)
        .toBe(false);
      expect(output.page.name)
        .toBeNull();
      expect(output.page.type)
        .toBeNull();
      expect(output.detail)
        .toBeNull();
      expect(output.straatbeeld)
        .toBeNull();
      expect(output.dataSelection)
        .toBeNull();
    });

    it('clears the straatbeeld when no straatbeeld id exists', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: { some: 'text' }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, 'linnaeus');

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('clears the straatbeeld when a straatbeeld is active', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: { id: 'object' }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, 'linnaeus');

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('clears straatbeeld when a straatbeeld is active with a location', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: { id: 'object', location: [1, 2], some: 'abc' }
      };
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, 'linnaeus');

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('disables the fullscreen mode of the map', () => {
      const inputState = {
        ...defaultState,
        ui: {
          ...defaultState.ui,
          isMapFullscreen: true
        }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, 'linnaeus');

      expect(output.ui.isMapFullscreen)
        .toBe(false);
    });

    it('when map and map panel and page are not an object', () => {
      const inputState = {
        ...defaultState,
        map: null,
        ui: null,
        page: null
      };


      const output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY](inputState, '');
      expect(output.map)
        .toBeNull();
      expect(output.ui)
        .toBeNull();
      expect(output.page)
        .toBeNull();
    });
  });

  describe('FETCH_SEARCH_RESULTS_BY_LOCATION', () => {
    it('resets the search query and active category and sets the search location', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'some query',
          location: null,
          category: 'adres',
          numberOfResults: 23
        }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.search.isLoading)
        .toBe(true);
      expect(output.search.query)
        .toBeNull();
      expect(output.search.location)
        .toEqual([52.001, 4.002]);
      expect(output.search.category)
        .toBeNull();
      expect(output.search.numberOfResults)
        .toBeNull();
    });

    it('sets query isFullscreen to false', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'some query',
          location: null,
          category: 'adres',
          numberOfResults: 23
        }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.search.isFullscreen)
        .toBe(false);
    });

    it('rounds the search location with a precision of 7 decimals', () => {
      const inputState = {
        ...defaultState,
        search: null
      };

      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](
        inputState,
        [52.123456789, 4.12345671]
      );

      expect(output.search.location)
        .toEqual([52.1234568, 4.1234567]);
    });

    it('hides the layer selection, active overlays, page, detail, straatbeeld and dataSelection', () => {
      const inputState = {
        ...defaultState,
        ui: {
          ...defaultState.ui,
          isMapPanelVisible: true
        },
        page: {
          ...defaultState.page,
          name: 'somePage'
        },
        search: {
          query: 'some query',
          location: null,
          category: 'adres',
          numberOfResults: 23
        },
        detail: {
          ...defaultState.detail,
          some: 'object'
        },
        straatbeeld: {
          ...defaultState.straatbeeld,
          some: 'object'
        },
        dataSelection: {
          ...defaultState.dataSelection,
          some: 'object'
        }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.page.name)
        .toBeNull();
      expect(output.detail)
        .toBeNull();
      expect(output.straatbeeld)
        .toBeNull();
      expect(output.dataSelection)
        .toBeNull();
    });

    it('does not change the viewCenter', () => {
      let output;
      const inputState = {
        ...defaultState,
        map: {
          ...defaultState.map,
          viewCenter: [52.123, 4.789]
        },
        ui: {
          ...defaultState.ui,
          isMapFullscreen: false
        }
      };

      // With fullscreen disabled, it doesn't change the viewCenter
      // eslint-disable-next-line max-len
      output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.map.viewCenter)
        .toEqual([52.123, 4.789]);

      // With fullscreen enabled, it still doesn't the viewCenter
      inputState.ui.isMapFullscreen = true;
      // eslint-disable-next-line max-len
      output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.map.viewCenter)
        .toEqual([52.123, 4.789]);
    });

    it('clears the straatbeeld', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: { some: 'text' }
      };


      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, 'linnaeus');

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('clears the straatbeeld when a straatbeeld is active', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: { some: 'object' }
      };


      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, 'linnaeus');

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('clears the straatbeeld when a straatbeeld is active with a location', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: { id: 'object', location: [1, 2], some: 'abc' }
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, 'linnaeus');

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('does not disable the fullscreen mode of the map', () => {
      const inputState = {
        ...defaultState,
        ui: {
          ...defaultState.ui,
          isMapFullscreen: true
        }
      };
      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.ui.isMapFullscreen)
        .toBe(true);
    });

    it('removes a drawn line from the map', () => {
      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](defaultState, [52.001, 4.002]);

      expect(output.map.geometry)
        .toEqual([]);
    });

    it('does not depend on a map being present', () => {
      const inputState = {
        ...defaultState,
        map: null
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);

      expect(output.map)
        .toBeNull();
    });

    it('when map panel and page are not an object', () => {
      const inputState = {
        ...defaultState,
        ui: null,
        page: null
      };

      // eslint-disable-next-line max-len
      const output = searchReducers[FETCH_SEARCH_RESULTS_BY_LOCATION](inputState, [52.001, 4.002]);
      expect(output.page)
        .toBeNull();
      expect(output.ui)
        .toBeNull();
    });
  });

  describe('FETCH_SEARCH_RESULTS_CATEGORY', () => {
    let inputState;
    let output;

    beforeEach(() => {
      inputState = {
        ...defaultState,
        search: {
          isLoading: false,
          query: 'Jan Beijerpad',
          location: null,
          category: null,
          numberOfResults: 23
        }
      };

      output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY](inputState, 'adres');
    });

    it('sets the active category', () => {
      expect(output.search.category)
        .toBe('adres');
    });

    it('sets the number of search results to null', () => {
      expect(output.search.numberOfResults)
        .toBeNull();
    });

    it('sets isLoading to true', () => {
      expect(output.search.isLoading)
        .toBe(true);
    });

    it('only updates the search state when a search is active', () => {
      // eslint-disable-next-line no-unused-vars
      const { search, ...state } = defaultState; // remove search
      output = searchReducers[ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY](state, 'adres');
      expect(output.search)
        .toBeUndefined();
    });
  });

  describe('SHOW_SEARCH_RESULTS', () => {
    let inputState;
    let output;
    beforeEach(() => {
      inputState = {
        ...defaultState,
        search: {
          isLoading: true,
          query: 'Jan Beijerpad',
          location: null,
          category: null,
          numberOfResults: null
        },
        map: {
          ...defaultState.map,
          isLoading: true
        }
      };

      // eslint-disable-next-line max-len
      output = searchReducers[ACTIONS.SHOW_SEARCH_RESULTS](inputState, 23);
    });

    it('sets the number of search results', () => {
      expect(output.search.numberOfResults)
        .toBe(23);
    });

    it('sets isLoading to false', () => {
      expect(output.search.isLoading)
        .toBe(false);
    });

    it('sets map isLoading to false when map is available', () => {
      expect(output.map.isLoading)
        .toBe(false);
    });

    it('does not set map isLoading to false when map is not available', () => {
      delete inputState.map;
      output = searchReducers[ACTIONS.SHOW_SEARCH_RESULTS](inputState, 23);
      expect(output.map)
        .toBeUndefined();
    });
  });

  describe('SHOW_SEARCH_RESULTS', () => {
    it('only updates the search state when a search is active', () => {
      // eslint-disable-next-line no-unused-vars
      const { search, ...state } = defaultState; // remove search
      const output = searchReducers[ACTIONS.SHOW_SEARCH_RESULTS](state, 23);
      expect(output.search)
        .toBeUndefined();
    });
  });
});
