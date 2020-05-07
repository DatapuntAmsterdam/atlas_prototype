import { shallow } from 'enzyme'
import React from 'react'
import configureMockStore from 'redux-mock-store'
import {
  getBrkMarkers,
  getClusterMarkers,
  getGeoJsons,
} from '../../../shared/ducks/data-selection/selectors'
import {
  fetchMapBaseLayers,
  FETCH_MAP_BASE_LAYERS_REQUEST,
  getUrlTemplate,
} from '../../ducks/base-layers/map-base-layers'
import { fetchMapLayers, FETCH_MAP_LAYERS_REQUEST } from '../../ducks/layers/map-layers'
import {
  setSelectedLocation,
  updateBoundingBox,
  updatePan,
  updateZoom,
} from '../../ducks/map/actions'
import { MAP_BOUNDING_BOX, MAP_PAN } from '../../ducks/map/constants'
import {
  getActiveBaseLayer,
  getCenter,
  getDrawingMode,
  getMapOverlays,
  getMapZoom,
  getMarkers,
  getRdGeoJsons,
  isMapLoading,
  isMarkerActive,
} from '../../ducks/map/selectors'
import {
  fetchPanelLayers,
  FETCH_PANEL_ITEMS_REQUEST,
} from '../../ducks/panel-layers/map-panel-layers'
import { isDrawingActive } from '../../services/draw-tool/draw-tool'
import LeafletContainer from './LeafletContainer'

jest.mock('../../../shared/ducks/data-selection/selectors')
jest.mock('../../ducks/base-layers/map-base-layers')
jest.mock('../../ducks/map/actions')
jest.mock('../../ducks/map/selectors')
jest.mock('../../ducks/layers/map-layers')
jest.mock('../../ducks/panel-layers/map-panel-layers')
jest.mock('../../services/draw-tool/draw-tool')

describe('LeafletContainer', () => {
  let initialState

  const mapLayers = {
    layers: {
      items: [
        {
          id: 'biz',
          url: 'maps/biz',
          layers: ['biz_polygons'],
          detailUrl: 'geosearch/biz/',
          detailParams: {
            item: 'biz',
          },
          detailIsShape: true,
        },
      ],
    },
    baseLayers: {
      items: [
        {
          value: 'topografie',
          label: 'Topografie',
          category: 'topography',
          selected: true,
          urlTemplate: 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
        },
        {
          value: 'lf2019',
          label: 'Luchtfoto 2019',
          category: 'aerial',
          selected: true,
          urlTemplate: 'https://{s}.data.amsterdam.nl/lufo2019_RD/{z}/{x}/{y}.jpeg',
        },
      ],
    },
  }

  beforeEach(() => {
    getActiveBaseLayer.mockImplementation(() => 'topografie')
    getCenter.mockImplementation(() => [0, 0])
    getMapZoom.mockImplementation(() => 8)
    getDrawingMode.mockImplementation(() => 'none')
    getBrkMarkers.mockImplementation(() => [])
    getClusterMarkers.mockImplementation(() => [])
    getGeoJsons.mockImplementation(() => [])
    getMapOverlays.mockImplementation(() => [])
    getMarkers.mockImplementation(() => [])
    getRdGeoJsons.mockImplementation(() => [])
    isMarkerActive.mockImplementation(() => true)
    updateBoundingBox.mockImplementation(() => ({}))
    updatePan.mockImplementation(() => ({}))
    setSelectedLocation.mockImplementation(() => ({}))
    updateZoom.mockImplementation(() => ({}))
    isMapLoading.mockImplementation(() => false)
    getUrlTemplate.mockImplementation(() => 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png')
  })

  describe('LeafletContainer snapshot', () => {
    beforeEach(() => {
      initialState = {
        mapLayers,
        map: {
          viewCenter: [52.4138254, 4.8728099],
          baseLayer: 'topografie',
          zoom: 9,
          overlays: [],
          drawingMode: 'none',
          isLoading: false,
        },
        user: {
          authenticated: false,
          accessToken: '',
        },
        mapDetail: {
          currentEndpoint: '',
          byEndpoint: {},
        },
        ui: {
          map: true,
          detail: false,
        },
        getLeafletInstance: () => '',
      }
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should render correct', () => {
      const store = configureMockStore()({ ...initialState })
      const wrapper = shallow(
        <LeafletContainer store={store} getLeafletInstance={initialState.getLeafletInstance} />,
      )
        .dive()
        .dive()

      expect(wrapper).toMatchSnapshot()
    })

    it('should render different baseLayer, zoom, center and an active layer', () => {
      const stateWithDifferentCenter = {
        ...initialState,
        map: {
          viewCenter: [52.4333137, 4.9108908],
          baseLayer: 'lf2019',
          zoom: 10,
          ui: {
            map: true,
            detail: true,
          },
          overlays: [
            {
              id: 'biz',
              isVisible: true,
            },
          ],
          drawingMode: 'none',
          isLoading: false,
        },
      }
      getCenter.mockImplementation(() => [52.4333137, 4.9108908])
      getMapZoom.mockImplementation(() => 10)
      getClusterMarkers.mockImplementation(() => [
        {
          index: 0,
          position: [52.37282671970971, 4.883399484657262],
          type: 'detailPointType',
        },
        {
          index: 1,
          position: [52.37282671970951, 4.883399484657232],
          type: 'detailPointType',
        },
        {
          index: 2,
          position: [52.37282671970952, 4.883399484657263],
          type: 'detailPointType',
        },
        {
          index: 3,
          position: [52.37282671971952, 4.883399484657263],
          type: 'detailPointType',
        },
      ])
      getGeoJsons.mockImplementation(() => [
        {
          geoJson: {
            coordinates: [120983, 487047],
            type: 'Point',
          },
          id: 'YE39',
          type: 'dataSelection',
        },
        {
          geoJson: {
            coordinates: [120983, 487047],
            type: 'Point',
          },
          id: 'YE39',
          type: 'dataSelectionAlternate',
        },
      ])
      getMapOverlays.mockImplementation(() => [
        {
          id: 'biz',
          isVisible: true,
        },
      ])
      getMarkers.mockImplementation(() => [
        {
          position: [52.37282671970971, 4.883399484657262],
          type: 'geoSearchType',
        },
        {
          position: [52.37282671970951, 4.883399484657232],
          type: 'detailPointType',
        },
        {
          position: [52.37282671970952, 4.883399484657263],
          type: 'dataSelectionType',
          iconData: 15,
        },
        {
          position: [52.37282671971952, 4.883399484657263],
          type: 'panoramaPersonType',
        },
        {
          position: [52.37282671971952, 4.883399484657263],
          type: 'panoramaOrientationType',
          heading: 45,
        },
      ])
      getRdGeoJsons.mockImplementation(() => [
        {
          geoJson: {
            coordinates: [120983, 487047],
            type: 'Point',
          },
          id: 'YE39',
        },
      ])
      const store = configureMockStore()({ ...stateWithDifferentCenter })
      const wrapper = shallow(
        <LeafletContainer store={store} getLeafletInstance={initialState.getLeafletInstance} />,
      )
        .dive()
        .dive()

      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('componentWillMount', () => {
    let spy
    let store
    let props
    beforeEach(() => {
      initialState = {
        map: {
          zoom: 8,
          drawingMode: 'none',
        },
        getLeafletInstance: () => '',
      }
      store = configureMockStore()({ ...initialState })
      props = {}

      spy = jest.spyOn(store, 'dispatch')

      fetchMapBaseLayers.mockImplementation(() => ({
        type: FETCH_MAP_BASE_LAYERS_REQUEST,
      }))
      fetchMapLayers.mockImplementation(() => ({
        type: FETCH_MAP_LAYERS_REQUEST,
      }))
      fetchPanelLayers.mockImplementation(() => ({
        type: FETCH_PANEL_ITEMS_REQUEST,
      }))
    })

    afterEach(() => {
      spy.mockReset()
      fetchMapBaseLayers.mockReset()
      fetchMapLayers.mockReset()
      fetchPanelLayers.mockReset()
    })

    it('should fetch the layers when urlTemplate is not set', () => {
      getUrlTemplate.mockImplementation(() => '')
      isMarkerActive.mockImplementation(() => true)

      shallow(
        <LeafletContainer
          store={store}
          {...props}
          getLeafletInstance={initialState.getLeafletInstance}
        />,
      )
        .dive()
        .dive()

      expect(fetchMapBaseLayers).toHaveBeenCalled()
      expect(fetchMapLayers).toHaveBeenCalled()
      expect(fetchPanelLayers).toHaveBeenCalled()
    })

    it('should NOT fetch the layers when urlTemplate is set', () => {
      getUrlTemplate.mockImplementation(
        () => 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
      )

      shallow(
        <LeafletContainer
          store={store}
          {...props}
          getLeafletInstance={initialState.getLeafletInstance}
        />,
      ).dive()

      expect(fetchMapBaseLayers).not.toHaveBeenCalled()
      expect(fetchMapLayers).not.toHaveBeenCalled()
      expect(fetchPanelLayers).not.toHaveBeenCalled()
    })
  })

  describe('LeafletContainer methods', () => {
    let store
    let wrapper
    let wrapperInstance
    let spy

    beforeEach(() => {
      initialState = {
        map: {
          zoom: 8,
          drawingMode: 'none',
        },
        getLeafletInstance: () => '',
      }

      getUrlTemplate.mockImplementation(
        () => 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
      )
      isDrawingActive.mockImplementation(() => true)

      store = configureMockStore()({ ...initialState })
      spy = jest.spyOn(store, 'dispatch')
      wrapper = shallow(
        <LeafletContainer getLeafletInstance={initialState.getLeafletInstance} store={store} />,
      )
        .dive()
        .dive()
      wrapperInstance = wrapper.instance()
    })

    afterEach(() => {
      spy.mockReset()
    })

    describe('setMapLeaflet', () => {
      it('should set the MapLeaflet', () => {
        wrapperInstance.setMapLeaflet({ map: '<FakeMmap />' })
        expect(wrapperInstance.MapLeaflet).toEqual({ map: '<FakeMmap />' })
      })
    })

    describe('handleZoom', () => {
      it('should trigger updateZoom and updateBoundingBox', () => {
        const event = { center: { lat: 1, lon: 5 } }

        wrapper.setProps({
          onUpdateZoom: jest.fn(),
          onUpdateBoundingBox: jest.fn(),
        })
        wrapperInstance.handleZoom(event)
        expect(wrapperInstance.props.onUpdateZoom).toHaveBeenCalled()
        expect(wrapperInstance.props.onUpdateBoundingBox).toHaveBeenCalled()
      })
    })

    describe('handlePan', () => {
      it('should trigger updatePan and updateBoundingBox', () => {
        const event = { center: { lat: 1, lon: 5 } }

        updatePan.mockImplementation(() => ({ type: MAP_PAN }))
        updateBoundingBox.mockImplementation(() => ({ type: MAP_BOUNDING_BOX }))

        wrapperInstance.handlePan(event)
        expect(store.dispatch).toHaveBeenCalledWith(updatePan())
        expect(store.dispatch).toHaveBeenCalledWith(updateBoundingBox())

        updateBoundingBox.mockReset()
      })
    })

    describe('handleResize', () => {
      it('should trigger updateBoundingBox', () => {
        const event = {}
        const action = {
          type: MAP_BOUNDING_BOX,
          payload: event,
        }
        isDrawingActive.mockImplementation(() => true)
        updateBoundingBox.mockImplementation(() => ({ type: MAP_BOUNDING_BOX }))

        wrapperInstance.handleResize(event)
        expect(store.dispatch).toHaveBeenCalledWith(updateBoundingBox(action, true))

        updateBoundingBox.mockReset()
      })
    })

    describe('handleClick', () => {
      it('should do nothing when the drawing is active or map is loading', () => {
        const event = {}
        wrapperInstance.handleClick(event)
        isMapLoading.mockImplementation(() => true)
        expect(store.dispatch).not.toHaveBeenCalled()
      })

      it('should trigger setSelectedLocation when the drawing is not active', () => {
        const event = { latlng: { lat: 0, lng: 0 } }
        isDrawingActive.mockImplementation(() => false)
        setSelectedLocation.mockImplementation(() => ({
          type: 'SOME_ACTION',
        }))
        wrapperInstance.handleClick(event)
        expect(setSelectedLocation).toHaveBeenCalledWith(event)
      })
    })
  })
})
