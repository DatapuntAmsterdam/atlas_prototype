import pageReducers from './page-reducers';

// deprecated!!! only used to quickly migrate away from Angular
const deepCopy = (oldObject) => JSON.parse(JSON.stringify(oldObject));

describe('The pageReducers', () => {
  const DEFAULT_STATE = {
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
  let mockedState;

  beforeEach(() => {
    mockedState = deepCopy(DEFAULT_STATE);
  });

  describe('SHOW_PAGE', () => {
    let output;

    it('sets page name', () => {
      output = pageReducers.SHOW_PAGE(mockedState, { name: 'welcome' });
      expect(output.page.name)
        .toBe('welcome');

      output = pageReducers.SHOW_PAGE(mockedState, { name: 'goodbye' });
      expect(output.page.name)
        .toBe('goodbye');
    });

    it('disables the layer selection, search, detail, straatbeeld and dataSelection', () => {
      mockedState.search = {
        query: 'SOME_QUERY',
        location: null
      };

      mockedState.ui.isMapPanelVisible = true;

      mockedState.detail = {
        endpoint: 'http://some-endpoint/path/123',
        isLoading: false
      };

      mockedState.straatbeeld = {
        id: 123,
        camera: 'WHATEVER',
        isLoading: false
      };

      mockedState.dataSelection = {
        some: 'object'
      };

      output = pageReducers.SHOW_PAGE(mockedState, { name: 'goodbye' });

      expect(output.search)
        .toBeNull();
      expect(output.ui.isMapPanelVisible)
        .toBe(false);
      expect(output.detail)
        .toBeNull();
      expect(output.straatbeeld)
        .toBeNull();
      expect(output.dataSelection)
        .toBeNull();
    });

    it('disables the full screen mode of the map', () => {
      mockedState.ui.isMapFullscreen = true;

      output = pageReducers.SHOW_PAGE(mockedState, { name: 'goodbye' });
      expect(output.ui.isMapFullscreen)
        .toBe(false);
    });

    it('when page is not an object', () => {
      mockedState.page = null;

      output = pageReducers.SHOW_PAGE(mockedState, { name: 'goodbye' });
      expect(output.page)
        .toBeNull();
    });

    it('when map is not an object', () => {
      mockedState.map = null;

      output = pageReducers.SHOW_PAGE(mockedState, { name: 'goodbye' });
      expect(output.map)
        .toBeNull();
    });

    it('when ui is not an object', () => {
      mockedState.ui = null;

      output = pageReducers.SHOW_PAGE(mockedState, { name: 'goodbye' });
      expect(output.ui)
        .toBeNull();
    });
  });
});
