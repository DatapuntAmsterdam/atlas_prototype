import reducer, {
  getMapClickLocation,
  SET_MAP_CLICK_LOCATION,
  setMapClickLocation,
  updateClick
} from './map-click-location';

import ACTIONS from '../../../shared/actions';

const initialState = {};
const location = {
  latitude: 52.38355767586716,
  longitude: 4.818084259094427
};
describe('reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should handle SET_MAP_CLICK_LOCATION', () => {
    const startAction = {
      type: SET_MAP_CLICK_LOCATION,
      location
    };
    expect(reducer({}, startAction)).toEqual({
      mapClickLocation: startAction.location
    });
  });
});

describe('actions', () => {
  describe('setMapClickLocation', () => {
    it('should create an action to add map click location', () => {
      const expectedAction = {
        type: SET_MAP_CLICK_LOCATION,
        location
      };
      expect(setMapClickLocation(location)).toEqual(expectedAction);
    });
  });

  describe('updateClick', () => {
    it('should create an action for setting the map click location', () => {
      const expectedAction = {
        type: ACTIONS.SET_MAP_CLICK_LOCATION,
        location
      };
      const payload = {
        latlng: {
          lat: location.latitude,
          lng: location.longitude
        }
      };
      expect(updateClick(payload)).toEqual(expectedAction);
    });
  });
});

describe('selectors', () => {
  describe('getMapClickLocation', () => {
    it('should return mapClickLocation', () => {
      expect(getMapClickLocation({ mapClickLocation: 123 })).toEqual(123);
    });
  });
});
