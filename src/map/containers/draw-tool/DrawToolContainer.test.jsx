import React from 'react'
import configureMockStore from 'redux-mock-store'
import { shallow } from 'enzyme'

import DrawToolContainer from './DrawToolContainer'
import drawToolConfig from '../../services/draw-tool/draw-tool.config'

import { isEnabled } from '../../services/draw-tool/draw-tool'
import { mapClear, mapSetDrawingMode, mapUpdateShape } from '../../ducks/map/actions'
import { setGeometryFilter } from '../../../shared/ducks/data-selection/actions'

jest.mock('../../services/draw-tool/draw-tool')

describe('DrawToolContainer', () => {
  let store
  let wrapper
  let wrapperInstance
  const initialState = {
    map: {
      baseLayer: '',
      overlays: [],
      drawingMode: 'none',
      shapeMarkers: 0,
      shapeDistanceTxt: '',
    },
    dataSelection: {
      geometryFilter: {
        markers: [],
      },
    },
  }

  const props = {
    currentShape: { markers: [] },
    leafletInstance: {},
    toggleDrawing: jest.fn(),
    cancel: jest.fn(),
    initialize: jest.fn(),
    setPolygon: jest.fn(),
    dataSelection: null,
  }

  const markers = [
    [52.37690230194533, 4.892827975989587],
    [52.376176949302526, 4.892688030418347],
    [52.37600183542343, 4.894145613811505],
  ]

  const polygonMock = {
    type: null,
    markers: [
      [52.37658883244462, 4.893694991480347],
      [52.3769023, 4.892828],
      [52.3761769, 4.892688],
      [52.3760018, 4.8941456],
    ],
    markersMaxCount: 40,
    area: 5482.935446954233,
    areaTxt: '5.482,9 m²',
    distance: 322.5467512423164,
    distanceTxt: '322,5 m',
  }

  beforeEach(() => {
    store = configureMockStore()({ ...initialState })
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should render DrawToolContainer', () => {
    const initializeMock = jest.spyOn(props, 'initialize')
    wrapper = shallow(<DrawToolContainer {...props} store={store} />)
      .dive()
      .dive()
      .dive()
    wrapperInstance = wrapper.instance()
    expect(wrapper).toMatchSnapshot()
    expect(initializeMock).toHaveBeenCalled()
  })

  describe('DrawToolContainer methods', () => {
    let spy
    beforeEach(() => {
      spy = jest.spyOn(store, 'dispatch')
      wrapper = shallow(<DrawToolContainer {...props} store={store} />)
        .dive()
        .dive()
        .dive()
      wrapperInstance = wrapper.instance()
    })

    afterEach(() => {
      spy.mockReset()
    })

    describe('componentWillUnmount', () => {
      it('should dispatch MAP_CLEAR when drawing mode is enabled', () => {
        wrapper.setProps({ drawingMode: drawToolConfig.DRAWING_MODE.DRAW })
        wrapper.unmount()
        expect(store.dispatch).toHaveBeenCalledWith(mapClear())
      })

      it('and should not dispatch MAP_CLEAR otherwise', () => {
        wrapper.setProps({ drawingMode: drawToolConfig.DRAWING_MODE.NONE })
        wrapper.unmount()
        expect(store.dispatch).not.toHaveBeenCalledWith(mapClear())
      })
    })

    describe('onDrawingMode', () => {
      it('should dispatch MAP_CHANGE_MAP_SET_DRAWING_MODEDRAWING_MODE when the drawing mode set to DRAW', () => {
        wrapper.setProps({ currentShape: { markers } })
        wrapperInstance.onDrawingMode(drawToolConfig.DRAWING_MODE.DRAW)
        expect(store.dispatch).toHaveBeenCalledWith(
          mapSetDrawingMode({ drawingMode: drawToolConfig.DRAWING_MODE.DRAW }),
        )
      })

      it('should dispatch MAP_SET_DRAWING_MODE when the drawing mode set to EDIT', () => {
        wrapper.setProps({ currentShape: { markers } })
        wrapperInstance.onDrawingMode(drawToolConfig.DRAWING_MODE.EDIT)
        expect(store.dispatch).toHaveBeenCalledWith(
          mapSetDrawingMode({ drawingMode: drawToolConfig.DRAWING_MODE.EDIT }),
        )
      })
    })

    describe('getMarkers', () => {
      it('should return an empty array when the geometry and the dataSelection are empty', () => {
        wrapper.setProps({ geometry: [], dataSelection: {} })
        const result = wrapperInstance.getMarkers()
        expect(result).toEqual([])
      })

      it('should return the geometry when it is set', () => {
        const geometry = [...markers]
        wrapper.setProps({ geometry, dataSelection: {} })
        const result = wrapperInstance.getMarkers()
        expect(result).toEqual(geometry)
      })

      it('should return the dataSelection when the geometry is not set', () => {
        const geometryFilterMarkers = [...markers]
        wrapper.setProps({
          geometry: [],
          dataSelection: { geometryFilter: { markers: geometryFilterMarkers } },
        })
        const result = wrapperInstance.getMarkers()
        expect(result).toEqual(geometryFilterMarkers)
      })
    })

    describe('onFinishShape', () => {
      it('should ignore the action when the polygon has only one point', () => {
        const polygon = {
          ...polygonMock,
          markers: [markers[0]],
        }
        const oldState = wrapperInstance.state
        wrapperInstance.onFinishShape(polygon)
        expect(wrapperInstance.state).toEqual(oldState)
        expect(store.dispatch).not.toHaveBeenCalled()
      })

      it('should not dispatch SET_GEOMETRY_FILTER when the polygon has only two points', () => {
        const polygon = {
          ...polygonMock,
          markers: [...markers.filter((item, index) => index < 2)],
        }
        wrapperInstance.onFinishShape(polygon)
        expect(store.dispatch).not.toHaveBeenCalledWith(setGeometryFilter(polygon))
      })

      it('should set new Markers and dispatch SET_GEOMETRY_FILTER when the polygon has more than two points', () => {
        const polygon = {
          ...polygonMock,
          markers: [...markers.filter((item, index) => index < 3)],
        }
        wrapperInstance.onFinishShape(polygon)
        expect(store.dispatch).toHaveBeenCalledWith(setGeometryFilter(polygon))
      })
    })

    describe('onUpdateShape', () => {
      it('should call onMapUpdateShape', () => {
        const newShape = { ...polygonMock }
        const expected = {
          shapeMarkers: newShape.markers.length,
          shapeDistanceTxt: newShape.distanceTxt,
          shapeAreaTxt: newShape.areaTxt,
        }

        wrapperInstance.onUpdateShape(newShape)

        expect(store.dispatch).toHaveBeenCalledWith(mapUpdateShape(expected))
      })
    })

    describe('setPolygon', () => {
      it('should be ignored when drawing is not enabled', () => {
        wrapperInstance.props.setPolygon.mockClear()
        isEnabled.mockImplementation(() => true)
        wrapperInstance.setPolygon()
        expect(wrapperInstance.props.setPolygon).not.toHaveBeenCalled()
      })
    })
  })
})
