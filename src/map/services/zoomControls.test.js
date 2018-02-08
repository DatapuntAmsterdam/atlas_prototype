import ACTIONS from '../../shared/actions';

import * as panControls from './panControls';
import {
    initialize,
    setZoom
} from './zoomControls';

describe('zoom controls', () => {
  let leafletOld;
  let leafletMap;
  let store;
  let scaleNode;
  let scaleControl;
  let zoomControl;
  let zoomEventHandler;

  const mapConfig = {
    SCALE_OPTIONS: 'foo',
    ZOOM_OPTIONS: 'bar',
    BASE_LAYER_OPTIONS: {
      maxZoom: 999
    }
  };

  beforeEach(() => {
    panControls.getCurrentLocation = jest.fn();

    store = {
      dispatch: jest.fn()
    };

    leafletMap = {
      doubleClickZoom: {
        enable: jest.fn(),
        disable: jest.fn()
      },
      getZoom: jest.fn(),
      setZoom: jest.fn(),
      on: (name, handler) => { zoomEventHandler = handler; }
    };

    scaleNode = document.createElement('div');
    scaleControl = {
      addTo: jest.fn(),
      getContainer: () => scaleNode
    };
    const scaleMock = jest.fn()
      .mockReturnValue(scaleControl);

    zoomControl = {
      addTo: jest.fn()
    };
    const zoomMock = jest.fn()
      .mockReturnValue(zoomControl);

    leafletOld = window.L;
    window.L = {
      control: {
        scale: scaleMock,
        zoom: zoomMock
      }
    };
  });

  afterEach(() => {
    window.L = leafletOld;
  });

  it('adds a scale to the map', () => {
    scaleNode.append = jest.fn();

    initialize(store, mapConfig, leafletMap);

    expect(window.L.control.scale.mock.calls[0][0]).toBe(mapConfig.SCALE_OPTIONS);
    expect(scaleControl.addTo.mock.calls[0][0]).toBe(leafletMap);
    expect(scaleNode.append.mock.calls[0][0].innerHTML).toBe('Kaartschaal');
  });

  it('does not add the scale control header if element is unavailable', () => {
    scaleNode = null;

    initialize(store, mapConfig, leafletMap);
  });

  it('adds zoom controls to the map', () => {
    initialize(store, mapConfig, leafletMap);

    expect(window.L.control.zoom.mock.calls[0][0]).toBe(mapConfig.ZOOM_OPTIONS);

    expect(zoomControl.addTo.mock.calls[0][0]).toBe(leafletMap);
  });


  describe('zoom', () => {
    it('sets the zoom level', () => {
      initialize(store, mapConfig, leafletMap);

      setZoom(leafletMap, 12);

      expect(leafletMap.setZoom.mock.calls[0][0]).toBe(12);
    });

    it('doesn\'t use animations when the zoom is triggered', () => {
      initialize(store, mapConfig, leafletMap);

      setZoom(leafletMap, 12);

      expect(leafletMap.setZoom.mock.calls[0][1]).toEqual({
        animate: false
      });
    });
  });


  it('fires action on Leaflet\'s zoomend event', () => {
    initialize(store, mapConfig, leafletMap);
    panControls.getCurrentLocation.mockReturnValue([1.3, 3.7]);
    leafletMap.getZoom.mockReturnValue(6);

    zoomEventHandler();

    expect(store.dispatch.mock.calls[0][0]).toEqual({
      type: ACTIONS.MAP_ZOOM,
      payload: {
        viewCenter: [1.3, 3.7],
        zoom: 6
      }
    });
  });

  describe('double click zooming', () => {
    // With doubleClickZoom enabled L.markercluster has issues (tg-2709)

    it('enables double click zoom on init', () => {
      initialize(store, mapConfig, leafletMap);

      expect(leafletMap.doubleClickZoom.enable.mock.calls.length).toBe(1);
    });

    it('enables double click zoom on normal zoom', () => {
      initialize(store, mapConfig, leafletMap);

      leafletMap.getZoom.mockReturnValue(20);
      zoomEventHandler();

      expect(leafletMap.doubleClickZoom.enable.mock.calls.length).toBe(2);
    });

    it('disables double click zoom on max zoom', () => {
      initialize(store, mapConfig, leafletMap);

      leafletMap.getZoom.mockReturnValue(mapConfig.BASE_LAYER_OPTIONS.maxZoom);
      zoomEventHandler();

      expect(leafletMap.doubleClickZoom.disable.mock.calls.length).toBe(1);
    });
  });
});
