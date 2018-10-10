import ACTIONS from '../../shared/actions';
import straatbeeldReducers from './straatbeeld-reducers';
import * as STRAATBEELD_CONFIG from '../../../modules/straatbeeld/straatbeeld-config';

describe('Straatbeeld reducers factory', () => {
  let defaultState;

  beforeAll(() => {
    STRAATBEELD_CONFIG.default = {
      DEFAULT_FOV: 79
    };
  });

  beforeEach(() => {
    // eslint-disable-next-line max-len
    // TODO: Note: before each required because somewhere in the reducer the map.viewCenter is mutated (not pure function).
    // Not fixing it with this refactor step.
    defaultState = {
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
  });

  describe('FETCH_STRAATBEELD_BY_ID', () => {
    let payload;

    beforeEach(() => {
      payload = {
        id: 'ABC',
        heading: 123,
        isInitial: true
      };
    });

    it('resets search results', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'linnaeus'
        }
      };

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.search).toBeNull();
    });
  });
});
