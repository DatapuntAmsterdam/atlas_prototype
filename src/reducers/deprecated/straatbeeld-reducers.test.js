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

    it('when heading is not in payload, use oldstate heading', () => {
      payload = {
        id: 'ABC',
        isInitial: true
      };

      const inputState = {
        ...defaultState,
        straatbeeld: {
          fov: 1,
          pitch: 2,
          date: 'today',
          heading: 179,
          hotspots: ['a', 'b'],
          location: ['lat', 'lon'],
          image: 'http://example.com/example.png'
        }
      };

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.straatbeeld.heading)
        .toBe(179);
    });

    it('when heading is in payload, use the payload heading', () => {
      const inputState = {
        ...defaultState
      };
      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.straatbeeld.heading)
        .toBe(123);
    });

    it('Set INITIAL id, heading, isInitial', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: null
      };
      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.straatbeeld)
        .toEqual(jasmine.objectContaining(payload));
    });

    it('Sets loading indication for map and straatbeeld', () => {
      const inputState = {
        ...defaultState
      };
      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.straatbeeld.isLoading)
        .toBe(true);
      expect(output.map.isLoading)
        .toBe(true);
    });

    it('resets previous straatbeeld variables', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: {
          fov: 1,
          pitch: 2,
          date: 'today',
          hotspots: ['a', 'b'],
          location: ['lat', 'lon'],
          image: 'http://example.com/example.png'
        }
      };

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);

      expect(output.straatbeeld.fov)
        .toBeNull();
      expect(output.straatbeeld.pitch)
        .toBeNull();
      expect(output.straatbeeld.date)
        .toBeNull();
      expect(output.straatbeeld.hotspots)
        .toEqual([]);
      expect(output.straatbeeld.location)
        .toBeNull();
      expect(output.straatbeeld.image)
        .toBeNull();
    });

    it('resets search results', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'linnaeus'
        }
      };

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.search)
        .toBeNull();
    });

    it('has a default heading of 0', () => {
      const inputState = {
        ...defaultState,
        search: {
          query: 'linnaeus'
        },
        straatbeeld: null
      };
      payload = {
        id: 'ABC',
        isInitial: true
      };

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.straatbeeld.heading)
        .toBe(0);
    });

    it('optionally sets straatbeeld to fullscreen', () => {
      const inputState = {
        ...defaultState,
        detail: {
          ...defaultState.detail,
          endpoint: 'bag/verblijfsobject/123/',
          geometry: 'aap',
          isLoading: false
        }
      };

      let output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.straatbeeld.isFullscreen)
        .toBeUndefined();

      payload.isFullscreen = true;
      output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](output, payload);
      expect(output.straatbeeld.isFullscreen)
        .toBe(true);

      delete payload.isFullscreen;
      output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](output, payload);
      expect(output.straatbeeld.isFullscreen)
        .toBe(true);

      payload.isFullscreen = false;
      output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](output, payload);
      expect(output.straatbeeld.isFullscreen)
        .toBe(false);

      delete payload.isFullscreen;
      output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](output, payload);
      expect(output.straatbeeld.isFullscreen)
        .toBeUndefined();
    });

    it('when map is not an object', () => {
      const inputState = {
        ...defaultState,
        map: null
      };

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_ID](inputState, payload);
      expect(output.map)
        .toBeNull();
    });
  });

  describe('STRAATBEELD_FULLSCREEN', () => {
    it('can set straatbeeld explicitly to fullscreen', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: {}
      };
      let output = straatbeeldReducers[ACTIONS.STRAATBEELD_FULLSCREEN](inputState);
      expect(output.straatbeeld.isFullscreen)
        .toBeUndefined();

      output = straatbeeldReducers[ACTIONS.STRAATBEELD_FULLSCREEN](output, true);
      expect(output.straatbeeld.isFullscreen)
        .toBe(true);
      output = straatbeeldReducers[ACTIONS.STRAATBEELD_FULLSCREEN](output);
      expect(output.straatbeeld.isFullscreen)
        .toBe(true);

      output = straatbeeldReducers[ACTIONS.STRAATBEELD_FULLSCREEN](output, false);
      expect(output.straatbeeld.isFullscreen)
        .toBe(false);
      output = straatbeeldReducers[ACTIONS.STRAATBEELD_FULLSCREEN](output);
      expect(output.straatbeeld.isFullscreen)
        .toBe(false);
    });

    it('when straatbeeld is not an object', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: null
      };

      const output = straatbeeldReducers[ACTIONS.STRAATBEELD_FULLSCREEN](inputState, undefined);
      expect(output.straatbeeld)
        .toBeNull();
    });
  });

  describe('SHOW_STRAATBEELD', () => {
    const payload = {
      date: new Date('2016-05-19T13:04:15.341110Z'),
      hotspots: [{
        id: 'ABC',
        heading: 179,
        distance: 3
      }],
      location: [52, 4],
      image: {
        pattern: 'http://example.com/example/{this}/{that}/{whatever}.png',
        preview: 'http://example.com/example/preview.png'
      }
    };

    let inputState;
    beforeEach(() => {
      inputState = {
        ...defaultState,
        straatbeeld: {
          isLoading: true,
          id: 'ABC',
          heading: 123,
          isInitial: true
        },
        detail: null
      };
    });

    it('Adds the payload to the state', () => {
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);

      expect(output.straatbeeld)
        .toEqual(jasmine.objectContaining(payload));
    });

    it('set defaults for pitch, fov when oldstate is unknown', () => {
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.straatbeeld.pitch)
        .toBe(0);
      expect(output.straatbeeld.fov)
        .toBe(79);
    });

    it('set Pitch and fov to output when oldstate is known', () => {
      inputState.straatbeeld.pitch = 1;
      inputState.straatbeeld.fov = 2;

      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.straatbeeld.pitch)
        .toBe(1);
      expect(output.straatbeeld.fov)
        .toBe(2);
    });

    it('sets viewcenter when no heading is known', () => {
      inputState.straatbeeld.heading = null;
      inputState.map = {};

      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.map.viewCenter)
        .toEqual(payload.location);
    });

    it('do not overwrite isLoading, id, heading, isInitial', () => {
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);

      expect(output.straatbeeld)
        .toEqual(jasmine.objectContaining({
          isLoading: false,
          id: 'ABC',
          heading: 123,
          isInitial: true
        }));
    });

    it('can set the straatbeeld to the new location', () => {
      const state = { straatbeeld: {}, ui: {} };

      const location = [52.001, 4.002];
      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION](state, location);

      expect(output.straatbeeld.id)
        .toBeNull();
      expect(output.straatbeeld.isLoading)
        .toBe(true);
      expect(output.straatbeeld.location)
        .toEqual(location);
      expect(output.straatbeeld.targetLocation)
        .toEqual(location);
    });

    it('centers the map when fullscreen map is active', () => {
      const state = {
        page: {},
        map: {},
        ui: {
          isMapPanelVisible: false,
          isMapFullscreen: true
        }
      };
      const location = [52.001, 4.002];

      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION](state, location);
      expect(output.map.viewCenter)
        .toEqual(location);
    });

    it('can set the straatbeeld to the new location from scratch', () => {
      const state = { ui: null };

      const location = [52.001, 4.002];
      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION](state, location);

      expect(output.straatbeeld.id)
        .toBeNull();
      expect(output.straatbeeld.isLoading)
        .toBe(true);
      expect(output.straatbeeld.location)
        .toEqual(location);
      expect(output.straatbeeld.targetLocation)
        .toEqual(location);
    });

    it('removes a drawn line from the map', () => {
      const state = { map: {}, ui: {} };
      const location = [52.001, 4.002];
      const output = straatbeeldReducers[ACTIONS.FETCH_STRAATBEELD_BY_LOCATION](state, location);

      expect(output.map.geometry)
        .toEqual([]);
    });

    it('heads towards a targetlocation when straatbeeld is loaded by location', () => {
      let output;

      [
        { target: [52, 4], heading: 0 },
        { target: [52, 5], heading: 90 },
        { target: [52, 3], heading: -90 },
        { target: [53, 5], heading: 45 },
        { target: [51, 3], heading: -135 },
        { target: [51, 5], heading: 135 }
      ].forEach(({ target, heading }) => {
        inputState.straatbeeld.targetLocation = target;
        inputState.straatbeeld.location = inputState.straatbeeld.targetLocation;
        output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
        expect(output.straatbeeld)
          .toEqual(jasmine.objectContaining({
            heading
          }));
      });
    });

    it('does not head towards a targetlocation when straatbeeld by location is reloaded', () => {
      // When a straatbeeld is reloaded, there is no target location available
      // There is a location available to denote that the straatbeeld origins from a location
      // The heading has already been calculated and saved on the first show of the straatbeeld
      // and should not be repeated
      inputState.straatbeeld.location = [1, 2];
      delete inputState.straatbeeld.targetLocation; // not saved in state, so not present on reload
      inputState.straatbeeld.heading = 'aap';
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.straatbeeld)
        .toEqual(jasmine.objectContaining({
          heading: inputState.straatbeeld.heading // keep original heading
        }));
    });

    it('Sets the map viewCenter when straatbeeld is loaded by id', () => {
      // When a straatbeeld is loaded by id the map should be centered on the location
      // Load by id is indicated by the absence of a location
      // The map center should not be set when the straatbeeld is loaded by location
      let output;

      delete inputState.straatbeeld.location;
      delete inputState.straatbeeld.targetLocation;
      inputState.map.viewCenter = 'aap';
      output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.map)
        .toEqual(jasmine.objectContaining({
          viewCenter: payload.location    // center map on payload location
        }));

      delete inputState.straatbeeld.location;
      inputState.straatbeeld.targetLocation = [1, 2];
      inputState.map.viewCenter = 'aap';
      output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.map)
        .toEqual(jasmine.objectContaining({
          viewCenter: payload.location    // center map on payload location
        }));

      inputState.straatbeeld.location = [1, 2];
      delete inputState.straatbeeld.targetLocation;
      inputState.map.viewCenter = 'aap';
      output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.map)
        .toEqual(jasmine.objectContaining({
          viewCenter: inputState.map.viewCenter   // keep original map viewCenter
        }));
    });

    it('Sets loading to false', () => {
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.straatbeeld.isLoading)
        .toBe(false);
      expect(output.map.isLoading)
        .toBe(false);
    });

    it('does nothing when straatbeeld is null', () => {
      inputState.straatbeeld = null;
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);

      expect(output.straatbeeld)
        .toBeNull();
    });

    it('sets the map viewcenter on first and every subsequent straatbeeld', () => {
      inputState.map.viewCenter = null;
      let output;

      payload.location = [5, 6];
      output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_INITIAL](inputState, payload);
      expect(output.map.viewCenter)
        .toEqual([5, 6]);

      payload.location = [3, 4];
      output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT](inputState, payload);
      expect(output.map.viewCenter)
        .toEqual([3, 4]);
    });

    it('only sets the map viewcenter on a subsequent straatbeeld when straatbeeld active', () => {
      inputState.straatbeeld = null;  // no straatbeeld is active
      const location = inputState.map.viewCenter;   // save location
      payload.location = [location[0] + 1, location[1] + 1];  // try to set to other location
      // eslint-disable-next-line max-len
      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT](inputState, payload);
      expect(output.map.viewCenter)
        .toEqual(location);  // location is not changed; equal to old location
    });

    it('when map and straatbeeld are not an object', () => {
      inputState.map = null;
      inputState.straatbeeld = null;

      const output = straatbeeldReducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT](inputState);
      expect(output.map)
        .toBeNull();
      expect(output.straatbeeld)
        .toBeNull();
    });
  });

  describe('setOrientationReducer', () => {
    it('updates the orientation with pitch and fov', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: {
          pitch: 1,
          fov: 2
        }
      };
      const payload = {
        heading: 91,
        pitch: 1,
        fov: 2
      };
      const output = straatbeeldReducers.SET_STRAATBEELD_ORIENTATION(inputState, payload);

      expect(output.straatbeeld.pitch)
        .toEqual(payload.pitch);
      expect(output.straatbeeld.fov)
        .toEqual(payload.fov);
    });

    it('when straatbeeld is not an object', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: null
      };

      const output = straatbeeldReducers.SET_STRAATBEELD_ORIENTATION(inputState);
      expect(output.straatbeeld)
        .toBeNull();
    });
  });

  describe('setStraatbeeldHistoryReducer', () => {
    it('sets the straatbeeld history selection', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: {}
      };

      const payload = 2020;
      const output = straatbeeldReducers.SET_STRAATBEELD_HISTORY(inputState, payload);

      expect(output.straatbeeld.history)
        .toEqual(payload);
    });


    it('updates the straatbeeld history selection', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: {
          history: 0
        }
      };

      const payload = 2020;
      const output = straatbeeldReducers.SET_STRAATBEELD_HISTORY(inputState, payload);

      expect(output.straatbeeld.history)
        .toEqual(payload);
    });

    it('can set the history selection to zero', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: {
          history: 2020
        }
      };

      const payload = 0;
      const output = straatbeeldReducers.SET_STRAATBEELD_HISTORY(inputState, payload);

      expect(output.straatbeeld.history)
        .toEqual(payload);
    });

    it('when straatbeeld is not an object', () => {
      const inputState = {
        ...defaultState,
        straatbeeld: null
      };

      const payload = 2020;
      const output = straatbeeldReducers.SET_STRAATBEELD_HISTORY(inputState, payload);
      expect(output.straatbeeld)
        .toBeNull();
    });
  });
});
