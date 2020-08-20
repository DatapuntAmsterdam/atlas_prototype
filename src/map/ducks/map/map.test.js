import {
  mapClear,
  mapEmptyGeometry,
  mapEndDrawing,
  mapLoadingAction,
  mapSetDrawingMode,
  mapUpdateShape,
  setMapBaseLayer,
  setSelectedLocation,
  toggleMapOverlay,
  toggleMapOverlayVisibility,
  toggleMapPanel,
  updateBoundingBox,
  updatePan,
  updateZoom,
} from './actions'
import { initialState } from './constants'
import reducer from './reducer'

describe('Map Reducer', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual(initialState)
  })

  it('should clear the map state', () => {
    const state = { shapeMarkers: 2 }
    expect(reducer(state, mapClear())).toEqual({
      ...state,
      overlays: initialState.overlays,
      drawingMode: initialState.drawingMode,
      shapeMarkers: initialState.shapeMarkers,
      shapeDistanceTxt: initialState.shapeDistanceTxt,
      shapeAreaTxt: initialState.shapeAreaTxt,
    })
  })

  it('should set the map loading status when dispatching mapLoadingAction', () => {
    expect(reducer(initialState, mapLoadingAction(true))).toEqual({
      ...initialState,
      isLoading: true,
    })
  })

  it('should clear the map drawing when dispatching mapEmptyGeometry', () => {
    expect(reducer({ geometry: ['foo'] }, mapEmptyGeometry())).toEqual({
      geometry: [],
    })
  })

  it('should set the shape state when dispatching mapUpdateShape', () => {
    const payloadAndResult = {
      shapeDistanceTxt: 'foo',
      shapeAreaTxt: 'bar',
    }
    expect(reducer({}, mapUpdateShape(payloadAndResult))).toEqual(payloadAndResult)
  })

  it('should set the drawing mode when dispatching mapSetDrawingMode', () => {
    const payloadAndResult = {
      drawingMode: 1,
    }
    expect(reducer({}, mapSetDrawingMode(payloadAndResult))).toEqual(payloadAndResult)
  })

  it('should set the geometry and drawing mode when dispatching mapEndDrawing', () => {
    expect(
      reducer(
        initialState,
        mapEndDrawing({
          polygon: {
            markers: [],
          },
        }),
      ),
    ).toEqual({
      ...initialState,
      drawingMode: 'none',
      geometry: undefined,
      isLoading: true,
    })

    expect(
      reducer(
        initialState,
        mapEndDrawing({
          polygon: {
            markers: [{}, {}, {}],
          },
        }),
      ),
    ).toEqual({
      ...initialState,
      drawingMode: 'none',
      geometry: [],
      isLoading: true,
    })

    expect(
      reducer(
        initialState,
        mapEndDrawing({
          polygon: {
            markers: [{}, {}],
          },
        }),
      ),
    ).toEqual({
      ...initialState,
      drawingMode: 'none',
      geometry: [{}, {}],
      isLoading: true,
    })
  })

  it('should set the drawing mode when dispatching setMapBaseLayer', () => {
    expect(reducer({}, setMapBaseLayer('baseLayer'))).toEqual({
      baseLayer: 'baseLayer',
    })
  })

  it('should update zoom when dispatching updateZoom', () => {
    expect(
      reducer(
        initialState,
        updateZoom({
          zoom: 12,
        }),
      ),
    ).toEqual({
      ...initialState,
      zoom: {
        zoom: 12,
      },
    })
  })

  it('should update panorama when dispatching updatePan', () => {
    expect(
      reducer(
        initialState,
        updatePan({
          lat: 51.3731081,
          lng: 5.8932945,
        }),
      ),
    ).toEqual({
      ...initialState,
      viewCenter: [51.3731081, 5.8932945],
    })
  })

  it('should toggle mapPanel when dispatching toggleMapPanel', () => {
    expect(reducer(initialState, toggleMapPanel())).toEqual({
      ...initialState,
      mapPanelActive: !initialState.mapPanelActive,
    })
  })

  it('should set a marker when location is selected', () => {
    expect(
      reducer(
        initialState,
        setSelectedLocation({
          latlng: {
            lat: 51.3731081,
            lng: 5.8932945,
          },
        }),
      ),
    ).toEqual({
      ...initialState,
    })
  })

  it('should set the boundingBox state when dispatching updateBoundingBox', () => {
    const expectedResult = {
      boundingBox: [123, 321],
    }
    expect(reducer({}, updateBoundingBox(expectedResult, true))).toEqual(expectedResult)
    expect(reducer({}, updateBoundingBox(expectedResult, false))).toEqual(expectedResult)
  })

  it('should remove toggled overlays from the active ones', () => {
    const state = {
      overlays: [{ id: '1' }, { id: '2' }, { id: '3' }],
    }

    const newOverlay = {
      legendItems: [{ id: '3' }],
    }

    // The legendItem is selectable, so must be removed
    expect(reducer(state, toggleMapOverlay(newOverlay))).toEqual({
      overlays: [{ id: '1' }, { id: '2' }],
    })
  })

  it('should add toggled overlays from to active ones', () => {
    const state = {
      overlays: [{ id: '2' }, { id: '3' }],
    }

    const newOverlay = {
      legendItems: [{ id: '4' }],
    }

    // The legendItem is selectable, so must be added
    expect(reducer(state, toggleMapOverlay(newOverlay))).toEqual({
      overlays: [{ id: '2' }, { id: '3' }, { id: '4', isVisible: true }],
    })
  })

  it('should toggle the overlay visibility with and without show action', () => {
    const state = {
      overlays: [{ id: '1' }, { id: '2' }, { id: '3' }],
    }
    expect(reducer(state, toggleMapOverlayVisibility('1', true))).toEqual({
      overlays: [
        { id: '1', isVisible: false },
        { id: '2', isVisible: undefined },
        { id: '3', isVisible: undefined },
      ],
    })
    expect(reducer(state, toggleMapOverlayVisibility('2'))).toEqual({
      overlays: [
        { id: '1', isVisible: undefined },
        { id: '2', isVisible: true },
        { id: '3', isVisible: undefined },
      ],
    })
  })
})
