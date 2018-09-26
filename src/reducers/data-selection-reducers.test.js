import ACTIONS from '../shared/actions';
import dataSelectionReducers from './data-selection-reducers';

// deprecated!!! only used to quickly migrate away from Angular
const deepCopy = (oldObject) => JSON.parse(JSON.stringify(oldObject));

describe('The dataSelectionReducers', () => {
  const DEFAULT_STATE = {
    map: {
      baseLayer: 'topografie',
      overlays: [],
      viewCenter: [52.3719, 4.9012],
      zoom: 9,
      isLoading: false
    },
    filters: {},
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

  it('is a map of actions to reducerlike functions', () => {
    expect(dataSelectionReducers)
      .toHaveProperty('FETCH_DATA_SELECTION');
    expect(dataSelectionReducers)
      .toHaveProperty('SHOW_DATA_SELECTION');
    expect(dataSelectionReducers)
      .toHaveProperty('RESET_DATA_SELECTION');
    expect(dataSelectionReducers)
      .toHaveProperty('NAVIGATE_DATA_SELECTION');
    expect(dataSelectionReducers)
      .toHaveProperty('SET_DATA_SELECTION_VIEW');
  });

  describe('FETCH_DATA_SELECTION', () => {
    let payload;

    beforeEach(() => {
      payload = {
        dataset: 'bag',
        page: 1
      };
    });

    it('makes the map small (!isFullscreen), relevant when navigating via dp-dropdown-menu', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.ui.isMapFullscreen = true;

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.ui.isMapFullscreen)
        .toBe(false);
    });

    it('has a default table view and set map not to be loading', () => {
      const mockedState = deepCopy(DEFAULT_STATE);

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          view: 'TABLE'
        }));
      expect(output.map.isLoading)
        .toEqual(false);
    });

    it('can display in list view and set map to be loading', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      payload.view = 'LIST';

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          view: 'LIST'
        }));
      expect(output.map.isLoading)
        .toEqual(true);
    });

    it('can display in list view from state', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.dataSelection = {
        view: 'LIST'
      };

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          view: 'LIST'
        }));
      expect(output.map.isLoading)
        .toEqual(true);
    });

    it('sets the dataSelection dataset, filters and page', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.filters = {
        buurtcombinatie: 'Geuzenbuurt',
        buurt: 'Trompbuurt'
      };
      payload.filters = {
        filter: 'filterValue'
      };

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          dataset: 'bag',
          page: 1
        }));

      expect(output.filters)
        .toEqual({
          filter: 'filterValue'
        });
    });

    it('sets the dataSelection dataset and page', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.filters = {
        buurtcombinatie: 'Geuzenbuurt',
        buurt: 'Trompbuurt'
      };

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          dataset: 'bag',
          page: 1
        }));

      expect(output.filters)
        .toEqual({
          buurtcombinatie: 'Geuzenbuurt',
          buurt: 'Trompbuurt'
        });
    });

    it('sets the dataSelection query, page, view, dataset and empties filters', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.filters = {
        buurtcombinatie: 'Geuzenbuurt',
        buurt: 'Trompbuurt'
      };

      payload.emptyFilters = true;

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          page: 1,
          view: 'TABLE',
          dataset: 'bag'
        }));
      expect(output.filters)
        .toEqual({});
    });

    it('can reset geometry filter', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      payload.resetGeometryFilter = true;

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.geometryFilter)
        .toEqual({
          markers: [],
          description: ''
        });
    });

    it('makes the Array of markers empty', () => {
      const mockedState = deepCopy(DEFAULT_STATE);

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toEqual(jasmine.objectContaining({
          markers: []
        }));
    });

    it('sets isLoading to true', () => {
      const mockedState = deepCopy(DEFAULT_STATE);

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.isLoading)
        .toBe(true);
    });

    it('disables search, page, detail and straatbeeld', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.search = { some: 'object' };
      mockedState.page.name = 'somePage';
      mockedState.detail = { some: 'object' };
      mockedState.straatbeeld = { some: 'object' };

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);

      expect(output.search)
        .toBeNull();
      expect(output.page.name)
        .toBeNull();
      expect(output.detail)
        .toBeNull();
      expect(output.straatbeeld)
        .toBeNull();
    });

    it('preserves the isPrintMode variable', () => {
      let output;
      const mockedState = deepCopy(DEFAULT_STATE);

      // With print mode enabled
      mockedState.ui.isPrintMode = true;
      output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);
      expect(output.ui.isPrintMode)
        .toBe(true);

      // With print mode disabled
      mockedState.ui.isPrintMode = false;
      output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, payload);
      expect(output.ui.isPrintMode)
        .toBe(false);
    });

    it('when payload is empty and map and ui and page are not an object', () => {
      const mockedState = deepCopy(DEFAULT_STATE);
      mockedState.map = null;
      mockedState.ui = null;
      mockedState.page = null;

      const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION](mockedState, '');
      expect(output.map)
        .toBeNull();
      expect(output.ui)
        .toBeNull();
      expect(output.page)
        .toBeNull();
    });
  });

  describe('SHOW_DATA_SELECTION', () => {
    let mockedState;
    let payload;
    let output;

    beforeEach(() => {
      mockedState = {
        dataSelection: {
          dataset: 'bag',
          page: 1,
          isLoading: true
        },
        filters: {
          buurtcombinatie: 'Geuzenbuurt',
          buurt: 'Trompbuurt'
        },
        map: {
          isLoading: true
        }
      };

      payload = ['MOCKED', 'MARKER', 'ARRAY'];
    });

    it('adds markers to the state', () => {
      output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.markers)
        .toEqual(['MOCKED', 'MARKER', 'ARRAY']);
    });

    it('sets isLoading to false', () => {
      output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.isLoading)
        .toEqual(false);
    });

    it('sets map isLoading to false', () => {
      output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

      expect(output.map.isLoading)
        .toEqual(false);
    });

    it('does nothing if the user has navigated away from dataSelection before the API is finished', () => {
      mockedState.dataSelection = null;
      output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toBeNull();
    });

    it('when map is not an object', () => {
      mockedState.map = null;

      output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);
      expect(output.map)
        .toBeNull();
    });
  });

  describe('RESET_DATA_SELECTION', () => {
    let mockedState;
    let payload;
    let output;

    beforeEach(() => {
      mockedState = {
        dataSelection: {
          dataset: 'bag',
          page: 1,
          isLoading: true
        },
        filters: {
          buurtcombinatie: 'Geuzenbuurt',
          buurt: 'Trompbuurt'
        },
        map: {
          isLoading: true
        }
      };

      payload = ['MOCKED', 'MARKER', 'ARRAY'];
    });

    it('adds markers to the state', () => {
      output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.markers)
        .toEqual(['MOCKED', 'MARKER', 'ARRAY']);
    });

    it('sets isLoading to false', () => {
      output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.isLoading)
        .toEqual(false);
    });

    it('sets map isLoading to false', () => {
      output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION](mockedState, payload);

      expect(output.map.isLoading)
        .toEqual(false);
    });

    it('does nothing if the user has navigated away from dataSelection before the API is finished', () => {
      mockedState.dataSelection = null;
      output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection)
        .toBeNull();
    });

    it('sets the reset flag to false', () => {
      mockedState.dataSelection.reset = true;
      output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION](mockedState, payload);

      expect(output.dataSelection.reset)
        .toBe(false);
    });

    it('when map is not an object', () => {
      mockedState.map = null;

      output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION](mockedState, payload);
      expect(output.map)
        .toBeNull();
    });
  });

  describe('SET_DATA_SELECTION_VIEW', () => {
    let mockedState;
    let payload;
    let output;

    beforeEach(() => {
      mockedState = {
        dataSelection: {
          dataset: 'bag',
          page: 1,
          isLoading: true
        },
        filters: {
          buurtcombinatie: 'Geuzenbuurt',
          buurt: 'Trompbuurt'
        },
        map: {}
      };
    });

    it('can set the view to list view and set map to be loading', () => {
      payload = 'LIST';

      output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW](mockedState, payload);

      expect(output.dataSelection.view)
        .toBe('LIST');
      expect(output.map.isLoading)
        .toBe(true);
    });

    it('can set the view to table view and set map not to be loading', () => {
      payload = 'TABLE';

      output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW](mockedState, payload);

      expect(output.dataSelection.view)
        .toBe('TABLE');
      expect(output.map.isLoading)
        .toBe(false);
    });

    it('refuses to set the view to an unknown view', () => {
      payload = 'aap';

      output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW](mockedState, payload);

      expect(output.dataSelection.view)
        .toBeUndefined();
    });

    it('sets isLoading to true', () => {
      payload = 'LIST';
      mockedState.dataSelection.isLoading = false;

      output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW](mockedState, payload);

      expect(output.dataSelection.isLoading)
        .toBe(true);
    });

    it('when dataSelection and map are not an object', () => {
      mockedState.dataSelection = null;
      mockedState.map = null;

      output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW](mockedState, 'LIST');
      expect(output.dataSelection)
        .toBeNull();
      expect(output.map)
        .toBeNull();
    });
  });

  describe('NAVIGATE_DATA_SELECTION', () => {
    it('updates the page', () => {
      const mockedState = deepCopy(DEFAULT_STATE);

      mockedState.dataSelection = {
        dataset: 'bag',
        page: 1
      };

      const output = dataSelectionReducers[ACTIONS.NAVIGATE_DATA_SELECTION](mockedState, 4);

      expect(output.dataSelection)
        .toEqual({
          dataset: 'bag',
          page: 4
        });
    });

    it('when dataSelection is not an object', () => {
      const mockedState = deepCopy(DEFAULT_STATE);

      mockedState.dataSelection = null;

      const output = dataSelectionReducers[ACTIONS.NAVIGATE_DATA_SELECTION](mockedState, 4);
      expect(output.dataSelection)
        .toBeNull();
    });
  });
});
