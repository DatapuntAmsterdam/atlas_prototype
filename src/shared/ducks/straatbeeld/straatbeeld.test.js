import reducer, {
  getStraatbeeld,
  getStraatbeeldHeading,
  getStraatbeeldLocation,
  getStraatbeeldMarkers,
  setStraatbeeldOff,
  STRAATBEELD_OFF
} from './straatbeeld';
import * as STRAATBEELD_CONFIG from '../../../../modules/straatbeeld/straatbeeld-config';
import ACTIONS from '../../actions';
import { routing } from '../../../app/routes';

describe('Straatbeeld Reducer', () => {
  let state;
  const defaultState = null;

  beforeAll(() => {
    state = reducer(undefined, {});
    STRAATBEELD_CONFIG.default = {
      DEFAULT_FOV: 79
    };
  });

  it('should set the initial state', () => {
    expect(state).toEqual({
      id: 'TMX7316010203-000719_pano_0000_000950',
      date: null,
      fov: null,
      heading: 0,
      history: 0,
      hotspots: [],
      image: null,
      isFullscreen: false,
      isInitial: true,
      isLoading: true,
      location: null,
      pitch: null
    });
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
        fov: 1,
        pitch: 2,
        date: 'today',
        heading: 179,
        hotspots: ['a', 'b'],
        location: ['lat', 'lon'],
        image: 'http://example.com/example.png'
      };

      const newState = reducer(inputState, { type: ACTIONS.FETCH_STRAATBEELD_BY_ID, payload });
      expect(newState.heading).toBe(179);
    });

    it('when heading is in payload, use the payload heading', () => {
      const inputState = {
        ...defaultState
      };
      const newState = reducer(inputState, { type: ACTIONS.FETCH_STRAATBEELD_BY_ID, payload });
      expect(newState.heading).toBe(123);
    });

    it('Set INITIAL id, heading, isInitial', () => {
      const inputState = {
        ...defaultState
      };
      const newState = reducer(inputState, { type: ACTIONS.FETCH_STRAATBEELD_BY_ID, payload });
      expect(newState).toEqual(jasmine.objectContaining(payload));
    });

    it('resets previous straatbeeld variables', () => {
      const inputState = {
        ...defaultState,
        fov: 1,
        pitch: 2,
        date: 'today',
        hotspots: ['a', 'b'],
        location: ['lat', 'lon'],
        image: 'http://example.com/example.png'
      };

      const newState = reducer(inputState, { type: ACTIONS.FETCH_STRAATBEELD_BY_ID, payload });

      expect(newState.fov).toBeNull();
      expect(newState.pitch).toBeNull();
      expect(newState.date).toBeNull();
      expect(newState.hotspots).toEqual([]);
      expect(newState.location).toBeNull();
      expect(newState.image).toBeNull();
    });

    it('has a default heading of 0', () => {
      const inputState = {
        ...defaultState
      };
      payload = {
        id: 'ABC',
        isInitial: true
      };

      const newState = reducer(inputState, { type: ACTIONS.FETCH_STRAATBEELD_BY_ID, payload });
      expect(newState.heading).toBe(0);
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
        isLoading: true,
        id: 'ABC',
        heading: 123,
        isInitial: true
      };
    });

    it('Adds the payload to the state', () => {
      const newState = reducer(inputState, { type: ACTIONS.SET_STRAATBEELD, payload });
      expect(newState).toEqual(jasmine.objectContaining(payload));
    });

    it('set defaults for pitch, fov when oldstate is unknown', () => {
      const newState = reducer(inputState, { type: ACTIONS.SET_STRAATBEELD, payload });
      expect(newState.pitch).toBe(0);
      expect(newState.fov).toBe(80);
    });

    it('set Pitch and fov to output when oldstate is known', () => {
      inputState.pitch = 1;
      inputState.fov = 2;

      const newState = reducer(inputState, { type: ACTIONS.SET_STRAATBEELD, payload });
      expect(newState.pitch).toBe(1);
      expect(newState.fov).toBe(2);
    });

    it('do not overwrite isLoading, id, heading, isInitial', () => {
      const newState = reducer(inputState, { type: ACTIONS.SET_STRAATBEELD, payload });

      expect(newState)
        .toEqual(jasmine.objectContaining({
          isLoading: false,
          id: 'ABC',
          heading: 123,
          isInitial: true
        }));
    });

    it('can set the straatbeeld to the new location', () => {
      inputState = {};
      const location = [52.001, 4.002];

      const newState = reducer(inputState, {
        type: ACTIONS.FETCH_STRAATBEELD_BY_LOCATION,
        payload: location
      });

      expect(newState.isLoading).toBe(true);
      expect(newState.location).toEqual(location);
      expect(newState.targetLocation).toEqual(location);
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
        inputState.targetLocation = target;
        inputState.location = inputState.targetLocation;

        output = reducer(inputState, {
          type: ACTIONS.SET_STRAATBEELD,
          payload
        });
        expect(output)
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
      inputState.location = [1, 2];
      delete inputState.targetLocation; // not saved in state, so not present on reload
      inputState.heading = 'aap';
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD,
        payload
      });
      expect(output)
        .toEqual(jasmine.objectContaining({
          heading: inputState.heading // keep original heading
        }));
    });

    it('Sets loading to false', () => {
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD,
        payload
      });
      expect(output.isLoading).toBe(false);
    });

    it('does nothing when straatbeeld is null', () => {
      inputState = null;
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD,
        payload
      });

      expect(output).toBeNull();
    });
  });

  describe('setOrientationReducer', () => {
    it('updates the orientation with pitch and fov', () => {
      const inputState = {
        ...defaultState,
        pitch: 1,
        fov: 2
      };
      const payload = {
        heading: 91,
        pitch: 1,
        fov: 2
      };
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD_ORIENTATION,
        payload
      });

      expect(output.pitch)
        .toEqual(payload.pitch);
      expect(output.fov)
        .toEqual(payload.fov);
    });

    it('when straatbeeld is not an object', () => {
      const inputState = {
        ...defaultState
      };

      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD_ORIENTATION
      });
      expect(output).toBeNull();
    });
  });

  describe('setStraatbeeldHistoryReducer', () => {
    it('sets the straatbeeld history selection', () => {
      const inputState = {};

      const payload = 2020;
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD_HISTORY,
        payload
      });

      expect(output.history).toEqual(payload);
    });

    it('updates the straatbeeld history selection', () => {
      const inputState = {
        ...defaultState,
        history: 0
      };

      const payload = 2020;
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD_HISTORY,
        payload
      });

      expect(output.history).toEqual(payload);
    });

    it('can set the history selection to zero', () => {
      const inputState = {
        ...defaultState,
        history: 2020
      };

      const payload = 0;
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD_HISTORY,
        payload
      });

      expect(output.history).toEqual(payload);
    });

    it('when straatbeeld is not an object', () => {
      const inputState = defaultState;

      const payload = 2020;
      const output = reducer(inputState, {
        type: ACTIONS.SET_STRAATBEELD_HISTORY,
        payload
      });
      expect(output).toBeNull();
    });
  });

  it(`should set the state to null when ${STRAATBEELD_OFF} and ${routing.map.type} is dispatched`, () => {
    expect(reducer(state, setStraatbeeldOff())).toEqual({});
  });
});

// SELECTORS
describe('straatbeeld selectors', () => {
  const straatbeeld = {
    location: [10, 10],
    heading: -134
  };
  describe('getStraatbeeld', () => {
    it('should return straatbeeld from the state', () => {
      const selected = getStraatbeeld({ straatbeeld });
      expect(selected).toEqual(straatbeeld);
    });
  });

  describe('getStraatbeeldLocation', () => {
    it('should return the location from the straatbeeld', () => {
      const selected = getStraatbeeldLocation.resultFunc(straatbeeld);
      expect(selected).toEqual(straatbeeld.location);
    });

    it('should return an empty string if straatbeeld is empty', () => {
      const selected = getStraatbeeldLocation.resultFunc('');
      expect(selected).toEqual('');
    });
  });

  describe('getStraatbeeldHeading', () => {
    it('should return the location from the straatbeeld', () => {
      const selected = getStraatbeeldHeading.resultFunc(straatbeeld);
      expect(selected).toEqual(straatbeeld.heading);
    });

    it('should return an empty string if straatbeeld is empty', () => {
      const selected = getStraatbeeldHeading.resultFunc('');
      expect(selected).toEqual('');
    });
  });

  describe('getStraatbeeldMarkers', () => {
    const { location, heading } = straatbeeld;
    it('should return an array of with 2 markers', () => {
      const selected = getStraatbeeldMarkers.resultFunc(location, heading);
      expect(selected).toEqual([
        {
          position: location,
          type: 'straatbeeldOrientationType',
          heading
        },
        {
          position: location,
          type: 'straatbeeldPersonType'
        }
      ]);
    });

    it('should return an empty array if there is no location', () => {
      const selected = getStraatbeeldMarkers.resultFunc('', heading);
      expect(selected).toEqual([]);
    });

    it('should return an array of with 2 markers with a default heading of 0 if there is no heading', () => {
      const selected = getStraatbeeldMarkers.resultFunc(location, '');
      expect(selected).toEqual([
        {
          position: location,
          type: 'straatbeeldOrientationType',
          heading: 0
        },
        {
          position: location,
          type: 'straatbeeldPersonType'
        }
      ]);
    });
  });
});

// ACTION CREATORS
describe('actions', () => {
  // describe('fetchMapBaseLayers', () => {
  //   it('should create an action to request straatbeeld by id', () => {
  //     const expectedAction = {
  //       type: FETCH_STRAATBEELD_BY_ID,
  //       payload: {
  //         id: 'id',
  //         heading: -130
  //       }
  //     };
  //     expect(showStraatbeeld(expectedAction.payload)).toEqual(expectedAction);
  //   });
  // });
});
