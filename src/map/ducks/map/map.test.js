import reducer, {
  mapClear,
  mapEmptyGeometry,
  mapEndDrawing,
  mapStartDrawing,
  mapUpdateShape,
  setMapBaseLayer,
  setSelectedLocation,
  toggleMapOverlay,
  toggleMapOverlayVisibility,
  toggleMapPanel,
  updateBoundingBox,
  updatePan,
  updateZoom,
  TOGGLE_MAP_OVERLAY_PANORAMA
} from './map';
import { routing } from '../../../app/routes';

describe('Map Reducer', () => {
  const initialState = {
    baseLayer: 'topografie',
    drawingMode: 'none',
    isLoading: false,
    overlays: [],
    shapeAreaTxt: '',
    shapeDistanceTxt: '',
    shapeMarkers: 0,
    viewCenter: [52.3731081, 4.8932945],
    zoom: 11,
    mapPanelActive: true
  };
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState);
  });

  it('should clear the map state', () => {
    const state = { shapeMarkers: 2 };
    expect(reducer(state, mapClear())).toEqual({
      ...state,
      overlays: [],
      drawingMode: initialState.drawingMode,
      shapeMarkers: initialState.shapeMarkers,
      shapeDistanceTxt: initialState.shapeDistanceTxt,
      shapeAreaTxt: initialState.shapeAreaTxt
    });
  });

  it('should clear the map drawing when dispatching mapEmptyGeometry', () => {
    expect(reducer({ geometry: ['foo'] }, mapEmptyGeometry())).toEqual({
      geometry: []
    });
  });

  it('should set the shape state when dispatching mapUpdateShape', () => {
    const payloadAndResult = {
      shapeMarkers: [1, 2],
      shapeDistanceTxt: 'foo',
      shapeAreaTxt: 'bar'
    };
    expect(reducer({}, mapUpdateShape(payloadAndResult))).toEqual(payloadAndResult);
  });

  it('should set the drawing mode when dispatching mapStartDrawing', () => {
    const payloadAndResult = {
      drawingMode: 1
    };
    expect(reducer({}, mapStartDrawing(payloadAndResult))).toEqual(payloadAndResult);
  });

  it('should set the geometry and drawing mode when dispatching mapEndDrawing', () => {
    expect(reducer(initialState, mapEndDrawing({
      polygon: {
        markers: []
      }
    }))).toEqual({
      ...initialState,
      drawingMode: 'none',
      geometry: undefined,
      isLoading: false
    });

    expect(reducer(initialState, mapEndDrawing({
      polygon: {
        markers: [{}, {}, {}]
      }
    }))).toEqual({
      ...initialState,
      drawingMode: 'none',
      geometry: [],
      isLoading: true
    });

    expect(reducer(initialState, mapEndDrawing({
      polygon: {
        markers: [{}, {}]
      }
    }))).toEqual({
      ...initialState,
      drawingMode: 'none',
      geometry: [{}, {}],
      isLoading: false
    });
  });

  it('should set the drawing mode when dispatching setMapBaseLayer', () => {
    expect(reducer({}, setMapBaseLayer('baseLayer'))).toEqual({
      baseLayer: 'baseLayer'
    });
  });

  it('should update zoom when dispatching updateZoom', () => {
    expect(reducer(initialState, updateZoom({
      zoom: 12
    }))).toEqual({
      ...initialState,
      zoom: {
        zoom: 12
      }
    });
  });

  it('should update panorama when dispatching updatePan', () => {
    expect(reducer(initialState, updatePan({
      lat: 51.3731081,
      lng: 5.8932945
    }))).toEqual({
      ...initialState,
      viewCenter: [51.3731081, 5.8932945]
    });
  });

  it('should toggle mapPanel when dispatching toggleMapPanel', () => {
    expect(reducer(initialState, toggleMapPanel()
    )).toEqual({
      ...initialState,
      mapPanelActive: !initialState.mapPanelActive
    });
  });

  it('should toggle mapPanel when opening detailPage or Panorama', () => {
    expect(reducer({}, {
      type: routing.dataDetail.type
    })).toEqual({
      mapPanelActive: false,
      overlays: []
    });

    expect(reducer({}, {
      type: routing.panorama.type
    })).toEqual({
      mapPanelActive: false
    });
  });

  it('should set a marker when location is selected', () => {
    expect(reducer(initialState, setSelectedLocation({
      latlng: {
        lat: 51.3731081,
        lng: 5.8932945
      }
    }))).toEqual({
      ...initialState
    });
  });

  it('should set the viewCenter and zoom state', () => {
    const expectedResult = {
      zoom: 1,
      viewCenter: [
        123, 321
      ],
      detailEndpoint: undefined,
      selectedLocation: undefined
    };
    expect(reducer({}, {
      type: routing.map.type,
      meta: {
        query: {
          zoom: 1,
          lat: 123,
          lng: 321
        }
      }
    })).toEqual(expectedResult);

    // Should also set viewCenter and Zoomstate when values cannot be parsed
    const expectedResultInitial = {
      zoom: initialState.zoom,
      viewCenter: initialState.viewCenter,
      mapPanelActive: false
    };
    expect(reducer({}, {
      type: routing.map.type,
      meta: {
        query: {
          zoom: 'test123',
          lat: 'test123',
          lng: 'test123',
          legenda: true
        }
      }
    })).toEqual(expectedResultInitial);
  });

  it('should set the overlays state', () => {
    const expectedResult = {
      overlays: [{ id: 'bag', isVisible: true }, { id: 'beg', isVisible: false }]
    };
    expect(reducer({}, {
      type: routing.map.type,
      meta: {
        query: {
          lagen: btoa('bag:1|beg:0')
        }
      }
    })).toEqual(expectedResult);
  });

  it('should set the boundingBox state when dispatching updateBoundingBox', () => {
    const expectedResult = {
      boundingBox: [
        123, 321
      ]
    };
    expect(reducer({}, updateBoundingBox(expectedResult, true))).toEqual(expectedResult);
    expect(reducer({}, updateBoundingBox(expectedResult, false))).toEqual(expectedResult);
  });

  it('should remove toggled overlays from the active ones', () => {
    const state = {
      overlays: [
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ]
    };

    const newOverlay = {
      legendItems: [
        { id: '3' }
      ]
    };
    expect(reducer(state, toggleMapOverlay(newOverlay))).toEqual({
      overlays: [
        { id: '1' },
        { id: '2' }
      ]
    });
  });

  it('should add toggled overlays from to active ones', () => {
    const state = {
      overlays: [
        { id: '2' },
        { id: '3' }
      ]
    };

    const newOverlay = {
      legendItems: [
        { id: '4' }
      ]
    };
    expect(reducer(state, toggleMapOverlay(newOverlay))).toEqual({
      overlays: [
        { id: '2' },
        { id: '3' },
        { id: '4', isVisible: true }
      ]
    });
  });

  it(`should add a pano overlay when dispatching ${TOGGLE_MAP_OVERLAY_PANORAMA}`, () => {
    expect(reducer({ overlays: [] }, {
      type: TOGGLE_MAP_OVERLAY_PANORAMA,
      payload: 'pano'
    })).toEqual({
      overlays: [{ id: 'pano', isVisible: true }]
    });

    // expect(reducer({ overlays: [{ id: 'pano' }] }, {
    //   type: TOGGLE_MAP_OVERLAY_PANORAMA,
    //   payload: 'pano'
    // })).toEqual({
    //   overlays: []
    // });
  });

  it('should toggle the overlay visibility with and without show action', () => {
    const state = {
      overlays: [
        { id: '1' },
        { id: '2' },
        { id: '3' }
      ]
    };
    expect(reducer(state, toggleMapOverlayVisibility('1', true))).toEqual({
      overlays: [
        { id: '1', isVisible: false },
        { id: '2', isVisible: undefined },
        { id: '3', isVisible: undefined }
      ]
    });
    expect(reducer(state, toggleMapOverlayVisibility('2'))).toEqual({
      overlays: [
        { id: '1', isVisible: undefined },
        { id: '2', isVisible: true },
        { id: '3', isVisible: undefined }
      ]
    });
  });
});
