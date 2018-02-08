import ACTIONS from '../../shared/actions';
import {
    getCurrentLocation,
    initialize,
    panTo
} from './panControls';

describe('zoom controls', () => {
  let leafletMap;
  let store;
  let dragEventHandler;
  const mockCenter = {
    lat: 1.3,
    lng: 3.7
  };

  beforeEach(() => {
    store = {
      dispatch: jest.fn()
    };

    leafletMap = {
      getCenter: () => mockCenter,
      panTo: jest.fn(),
      on: (name, handler) => { dragEventHandler = handler; }
    };
  });


  it('exposes the getCurrentLocation function', () => {
    expect(getCurrentLocation(leafletMap)).toEqual(Object.values(mockCenter));
  });


  it('can pan to a location', () => {
    const newLocation = [1.2, 3.4];

    panTo(leafletMap, newLocation);

    expect(leafletMap.panTo.mock.calls[0][0]).toBe(newLocation);
    expect(leafletMap.panTo.mock.calls[0][1]).toEqual({ animate: false });
  });

  it('prevents infinite loops; it won\'t fire if the new location is equal to the current location', () => {
    panTo(leafletMap, Object.values(mockCenter));

    expect(leafletMap.panTo.mock.calls.length).toBe(0);
  });

  it('listens for Leaflet\'s dragend event, then it fires the MAP_PAN action', () => {
    initialize(store, leafletMap);

    dragEventHandler();

    expect(store.dispatch.mock.calls[0][0]).toEqual({
      type: ACTIONS.MAP_PAN,
      payload: Object.values(mockCenter)
    });
  });
});
