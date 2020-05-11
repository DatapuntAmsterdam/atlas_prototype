import React from 'react'
import { shallow } from 'enzyme'

import MapLeaflet from './MapLeaflet'

import MAP_CONFIG from '../../services/map.config'

import { boundsToString, getBounds, isValidBounds, isBoundsAPoint } from './services/bounds'
import { markerPointType } from '../../ducks/map/constants'

jest.mock('./services/bounds')

describe('MapLeaflet component', () => {
  const mapOptions = MAP_CONFIG.MAP_OPTIONS
  const scaleControlOptions = MAP_CONFIG.SCALE_OPTIONS
  const zoomControlOptions = MAP_CONFIG.ZOOM_OPTIONS

  const getLeafletInstance = () => ''
  const baseLayer = {
    baseLayerOptions: {
      bounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
      maxZoom: 16,
      minZoom: 8,
      subdomains: ['acc.t1', 'acc.t2', 'acc.t3', 'acc.t4'],
      tms: true,
    },
    urlTemplate: 'https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png',
  }

  it('should render map with base layer and update base layer if props change', () => {
    const center = [52.3731081, 4.8932945]
    const marker = {
      position: [...center],
      type: markerPointType,
      iconData: { type: 'foo' },
    }
    const clickHandler = jest.fn()
    const wrapper = shallow(
      <MapLeaflet
        baseLayer={baseLayer}
        center={center}
        getLeafletInstance={getLeafletInstance}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        brkMarkers={[]}
        marker={marker}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
      />,
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      baseLayer: {
        ...baseLayer,
        urlTemplate: 'https://{s}.data.amsterdam.nl/lufo2017_RD/{z}/{x}/{y}.jpeg',
      },
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should render map with without layers and add/remove layers if props change', () => {
    const center = [52.3731081, 4.8932945]
    const clickHandler = jest.fn()
    const layers = []
    const wrapper = shallow(
      <MapLeaflet
        brkMarkers={[]}
        baseLayer={baseLayer}
        center={center}
        getLeafletInstance={getLeafletInstance}
        layers={layers}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
      />,
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [
        {
          id: 'biz',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['biz_polygons'],
          },
          transparent: true,
          url: 'https://acc.map.data.amsterdam.nl/maps/biz',
        },
      ],
    })
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [],
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should render map with geoJSON with RD coordinates', () => {
    const center = [52.3731081, 4.8932945]
    const clickHandler = jest.fn()
    const layers = []
    const wrapper = shallow(
      <MapLeaflet
        brkMarkers={[]}
        baseLayer={baseLayer}
        center={center}
        getLeafletInstance={getLeafletInstance}
        layers={layers}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
      />,
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [
        {
          id: 'biz',
          isVisible: false,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['biz_polygons'],
          },
          transparent: true,
          url: 'https://acc.map.data.amsterdam.nl/maps/biz',
        },
      ],
      rdGeoJsons: [
        {
          geoJson: {
            geometry: {
              coordinates: [120983, 487047],
              type: 'Point',
            },
          },
          id: 'YE39',
        },
      ],
    })
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [
        {
          id: 'biz',
          isVisible: false,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['biz_polygons'],
          },
          transparent: true,
          url: 'https://acc.map.data.amsterdam.nl/maps/biz',
        },
      ],
      rdGeoJsons: [
        {
          geoJson: {
            geometry: {
              coordinates: [120983, 487047],
              type: 'Point',
            },
            label: 'Adres YE39',
          },
          id: 'YE39',
        },
      ],
    })
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [
        {
          id: 'bbn',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['bouwblok', 'bouwblok_label'],
          },
          transparent: true,
          url: 'https://acc.map.data.amsterdam.nl/maps/gebieden?service=wms',
        },
      ],
      rdGeoJsons: [
        {
          geoJson: {
            geometry: {
              coordinates: [
                [
                  [
                    [[115689.261, 488181.641]],
                    [[115697.26, 488181.8]],
                    [[115705.37, 488181.959]],
                    [[115705.522, 488173.844]],
                    [[115705.67, 488165.845]],
                    [[115705.819, 488157.847]],
                    [[115705.969, 488149.729]],
                    [[115697.865, 488149.576]],
                    [[115689.866, 488149.424]],
                    [[115681.759, 488149.269]],
                    [[115681.15, 488181.479]],
                    [[115689.261, 488181.641]],
                  ],
                ],
              ],
              type: 'MultiPolygon',
            },
            label: 'Object YE39',
          },
          id: 'YE39',
        },
      ],
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should render map with coordinates in lat/lon', () => {
    const center = [52.3731081, 4.8932945]
    const clickHandler = jest.fn()
    const layers = []
    const wrapper = shallow(
      <MapLeaflet
        baseLayer={baseLayer}
        center={center}
        brkMarkers={[]}
        getLeafletInstance={getLeafletInstance}
        layers={layers}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
      />,
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [
        {
          id: 'biz',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['biz_polygons'],
          },
          transparent: true,
          url: 'https://acc.map.data.amsterdam.nl/maps/biz',
        },
      ],
      geoJsons: [
        {},
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
        {
          geoJson: {
            coordinates: [
              [[115689.261, 488181.641]],
              [[115697.26, 488181.8]],
              [[115705.37, 488181.959]],
              [[115705.522, 488173.844]],
              [[115705.67, 488165.845]],
              [[115705.819, 488157.847]],
              [[115705.969, 488149.729]],
              [[115697.865, 488149.576]],
              [[115689.866, 488149.424]],
              [[115681.759, 488149.269]],
              [[115681.15, 488181.479]],
              [[115689.261, 488181.641]],
            ],
            type: 'Polygon',
          },
          id: 'YE39',
          type: 'dataSelectionBounds',
        },
      ],
    })
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      layers: [
        {
          id: 'bbn',
          isVisible: true,
          overlayOptions: {
            format: 'image/png',
            identify: false,
            layers: ['bouwblok', 'bouwblok_label'],
          },
          transparent: true,
          url: 'https://acc.map.data.amsterdam.nl/maps/gebieden?service=wms',
        },
      ],
      geoJsons: [
        {
          geoJson: {
            coordinates: [
              [
                [
                  [[115689.261, 488181.641]],
                  [[115697.26, 488181.8]],
                  [[115705.37, 488181.959]],
                  [[115705.522, 488173.844]],
                  [[115705.67, 488165.845]],
                  [[115705.819, 488157.847]],
                  [[115705.969, 488149.729]],
                  [[115697.865, 488149.576]],
                  [[115689.866, 488149.424]],
                  [[115681.759, 488149.269]],
                  [[115681.15, 488181.479]],
                  [[115689.261, 488181.641]],
                ],
              ],
            ],
            type: 'MultiPolygon',
          },
          id: 'YE39',
          type: 'dataSelection',
        },
      ],
    })
    expect(wrapper).toMatchSnapshot()
  })

  it('should render clusters', () => {
    const center = [52.3731081, 4.8932945]
    const zoom = 11
    const clusterMarkers = [
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
    ]
    const clickHandler = jest.fn()
    const layers = []
    const wrapper = shallow(
      <MapLeaflet
        baseLayer={baseLayer}
        center={center}
        brkMarkers={[]}
        clusterMarkers={clusterMarkers}
        getLeafletInstance={getLeafletInstance}
        layers={layers}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
        zoom={zoom}
      />,
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      zoom: 9,
    })

    expect(wrapper).toMatchSnapshot()
  })

  it('should render markers', () => {
    const center = [52.3731081, 4.8932945]
    const zoom = 11
    const markers = [
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
        iconData: {
          zoomLevel: 0,
          count: 1,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 9,
          count: 9,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 13,
          count: 99,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 14,
          count: 9999,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 15,
          count: 100,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 16,
          count: 10,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 19,
          count: 2,
        },
      },
      {
        position: [52.37282671970952, 4.883399484657263],
        type: 'dataSelectionType',
        iconData: {
          zoomLevel: 99,
          count: 1,
        },
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
    ]
    const clickHandler = jest.fn()
    const layers = []
    const wrapper = shallow(
      <MapLeaflet
        baseLayer={baseLayer}
        center={center}
        markers={markers}
        brkMarkers={[]}
        getLeafletInstance={getLeafletInstance}
        layers={layers}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
        zoom={zoom}
      />,
    )
    expect(wrapper).toMatchSnapshot()

    wrapper.setProps({
      zoom: 9,
    })

    expect(wrapper).toMatchSnapshot()
  })

  it('should render brkMarkers', () => {
    const center = [52.3731081, 4.8932945]
    const zoom = 11
    const brkMarkers = [
      {
        iconData: {
          zoomLevel: 14,
          count: 4,
        },
        position: [52.378971546685705, 4.854030078341637],
        type: 'dataSelectionType',
      },
    ]
    const clickHandler = jest.fn()
    const layers = []
    const wrapper = shallow(
      <MapLeaflet
        baseLayer={baseLayer}
        center={center}
        markers={[]}
        brkMarkers={brkMarkers}
        getLeafletInstance={getLeafletInstance}
        layers={layers}
        mapOptions={mapOptions}
        onZoomEnd={clickHandler}
        scaleControlOptions={scaleControlOptions}
        zoomControlOptions={zoomControlOptions}
        zoom={zoom}
      />,
    )
    expect(wrapper).toMatchSnapshot()
  })

  describe('MapLeaflet methods', () => {
    let wrapper
    let wrapperInstance
    let props

    const leafletMapMock = {
      getBounds: jest.fn(),
      getBoundsZoom: jest.fn(),
      fitBounds: jest.fn(),
      invalidateSize: jest.fn(),
      getZoom: jest.fn(),
      getMaxZoom: jest.fn(),
      getMinZoom: jest.fn(),
      getCenter: jest.fn(),
      panInsideBounds: jest.fn(),
      getNorthEast: jest.fn(),
      getSouthWest: jest.fn(),
    }

    const bounds = {
      _northEast: { lat: 1, lng: 2 },
      _southWest: { lat: 3, lng: 4 },
      contains: jest.fn(),
    }
    const convertedBounds = {
      northEast: [1, 2],
      southWest: [3, 4],
    }

    beforeEach(() => {
      props = {
        center: [52.3731081, 4.8932945],
        layers: [],
        onClick: jest.fn(),
        onZoomEnd: jest.fn(),
        onDragEnd: jest.fn(),
        onResizeEnd: jest.fn(),
      }

      wrapper = shallow(
        <MapLeaflet
          brkMarkers={[]}
          baseLayer={baseLayer}
          getLeafletInstance={getLeafletInstance}
          mapOptions={mapOptions}
          scaleControlOptions={scaleControlOptions}
          zoomControlOptions={zoomControlOptions}
          {...props}
        />,
      )
      wrapperInstance = wrapper.instance()
      wrapperInstance.setMapElement({ leafletElement: leafletMapMock })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should ignore setMapElement when is not provided', () => {
      wrapperInstance.setMapElement()
      expect(wrapperInstance.MapElement).toEqual(leafletMapMock)
    })

    it('should ignore setActiveElement when is not provided', () => {
      wrapperInstance.setActiveElement()
      expect(wrapperInstance.activeElement).toBeFalsy()
    })

    it('should setActiveElement', () => {
      wrapperInstance.checkIfActiveElementNeedsUpdate = jest.fn()
      expect(wrapperInstance.activeElement).toBeFalsy()
      wrapperInstance.setActiveElement({ leafletElement: leafletMapMock })
      expect(wrapperInstance.activeElement).toBeTruthy()
      expect(wrapperInstance.checkIfActiveElementNeedsUpdate).toHaveBeenCalledWith(leafletMapMock)
    })

    it('should delegate the onZoomEnd event', () => {
      const event = { target: leafletMapMock }
      wrapperInstance.MapElement.getBounds.mockImplementation(() => bounds)
      wrapperInstance.onZoomEnd(event)
      expect(props.onZoomEnd).toHaveBeenCalled()
    })

    it('should delegate the onClick event', () => {
      const event = { latlng: null, containerPoint: null, layerPoint: null }
      wrapperInstance.onClick(event)
      expect(props.onClick).toHaveBeenCalledWith(event)
    })

    it('should delegate the onDragEnd event ', () => {
      leafletMapMock.getCenter.mockImplementation(() => props.center)
      const event = { target: leafletMapMock }
      wrapperInstance.MapElement.getBounds.mockImplementation(() => bounds)
      wrapperInstance.onDragEnd(event)
      expect(props.onDragEnd).toHaveBeenCalledWith({
        center: props.center,
        boundingBox: convertedBounds,
      })
    })

    it('should fit the active element when onClusterGroupBounds', () => {
      wrapperInstance.fitActiveElement = jest.fn()
      wrapperInstance.onClusterGroupBounds(bounds)
      expect(wrapperInstance.fitActiveElement).toHaveBeenCalledWith(bounds)
    })

    it('should handleResize and ignore the activeElement when it is not present', () => {
      wrapperInstance.MapElement.getBounds.mockImplementation(() => bounds)
      wrapperInstance.fitActiveElement = jest.fn()

      wrapperInstance.handleResize()

      expect(wrapperInstance.MapElement.invalidateSize).toHaveBeenCalled()
      expect(props.onResizeEnd).toHaveBeenCalledWith({
        boundingBox: convertedBounds,
      })
      expect(wrapperInstance.fitActiveElement).not.toHaveBeenCalled()
    })

    it('should handleResize and set the activeElement when it is present', () => {
      wrapperInstance.MapElement.getBounds.mockImplementation(() => bounds)
      wrapperInstance.fitActiveElement = jest.fn()
      getBounds.mockImplementation(() => bounds)
      wrapperInstance.setActiveElement({ leafletElement: leafletMapMock })

      wrapperInstance.handleResize()

      expect(wrapperInstance.MapElement.invalidateSize).toHaveBeenCalled()
      expect(props.onResizeEnd).toHaveBeenCalledWith({
        boundingBox: convertedBounds,
      })
      expect(wrapperInstance.fitActiveElement).toHaveBeenCalledWith(bounds)
    })

    describe('checkIfActiveElementNeedsUpdate (todo: rename to updateActiveElement)', () => {
      it('should NOT update if the bounds are the same', () => {
        const elementBoundsString = 'elementBoundsString'
        boundsToString.mockImplementation(() => elementBoundsString)
        isValidBounds.mockImplementation(() => true)
        wrapperInstance.fitActiveElement = jest.fn()
        wrapperInstance.zoomToActiveElement = jest.fn()

        wrapper.setState({ previousFitBoundsId: elementBoundsString })
        const oldState = wrapperInstance.state

        wrapperInstance.checkIfActiveElementNeedsUpdate(leafletMapMock)

        expect(wrapperInstance.fitActiveElement).not.toHaveBeenCalled()
        expect(wrapperInstance.zoomToActiveElement).not.toHaveBeenCalled()
        expect(wrapperInstance.state).toEqual(oldState)
      })

      it('should update if the bounds are changed', () => {
        const elementBoundsString = 'elementBoundsString'
        getBounds.mockImplementation(() => bounds)
        boundsToString.mockImplementation(() => `${elementBoundsString}New`)
        isValidBounds.mockImplementation(() => true)
        wrapperInstance.zoomToActiveElement = jest.fn()
        wrapperInstance.fitActiveElement = jest.fn()

        wrapper.setState({ previousFitBoundsId: elementBoundsString })
        const oldState = wrapperInstance.state
        const newState = {
          ...oldState,
          previousFitBoundsId: `${elementBoundsString}New`,
        }

        wrapperInstance.checkIfActiveElementNeedsUpdate(leafletMapMock)

        expect(wrapperInstance.fitActiveElement).toHaveBeenCalledWith(bounds)
        expect(wrapperInstance.zoomToActiveElement).toHaveBeenCalledWith(bounds)
        expect(wrapperInstance.state).toEqual(newState)
      })
    })

    describe('zoomToActiveElement', () => {
      it('should not zoom if the bounds are not valid', () => {
        isBoundsAPoint.mockImplementation(() => false)
        wrapperInstance.zoomToActiveElement(bounds)
        expect(wrapperInstance.MapElement.fitBounds).not.toHaveBeenCalled()
      })

      it('should not zoom if the zoom level is to high', () => {
        isBoundsAPoint.mockImplementation(() => true)
        wrapperInstance.MapElement.getBoundsZoom.mockImplementation(() => 10)
        wrapperInstance.zoomToActiveElement(bounds)
        expect(wrapperInstance.MapElement.fitBounds).not.toHaveBeenCalled()
      })

      it('should zoom if the zoom level is acceptable and the bounds are correct', () => {
        isBoundsAPoint.mockImplementation(() => false)
        // zoom = 11, boundsZoom = 15, maxZoom = 12
        wrapperInstance.MapElement.getBoundsZoom.mockImplementation(() => 15)
        wrapperInstance.zoomToActiveElement(bounds)
        expect(wrapperInstance.MapElement.fitBounds).toHaveBeenCalledWith(bounds, { maxZoom: 12 })
      })
    })

    describe('fitActiveElement', () => {
      it('should do nothing if the bounds are not valid', () => {
        isValidBounds.mockImplementation(() => false)
        wrapperInstance.fitActiveElement(bounds)
        expect(wrapperInstance.MapElement.getBounds).not.toHaveBeenCalled()
      })

      it('should do nothing when the element fits in the bounds', () => {
        isValidBounds.mockImplementation(() => true)
        bounds.contains.mockImplementation(() => true)
        wrapperInstance.MapElement.getBounds.mockImplementation(() => bounds)
        wrapperInstance.fitActiveElement(bounds)
        expect(wrapperInstance.MapElement.fitBounds).not.toHaveBeenCalled()
        expect(wrapperInstance.MapElement.panInsideBounds).not.toHaveBeenCalled()
      })

      describe('when element fits the bounds', () => {
        beforeEach(() => {
          isValidBounds.mockImplementation(() => true)
          bounds.contains.mockImplementation(() => false)
          wrapperInstance.MapElement.getBounds.mockImplementation(() => bounds)
        })

        it('should zoom and pan to the element when the zoom level is to low', () => {
          wrapperInstance.MapElement.getBoundsZoom.mockImplementation(() => 8)
          wrapperInstance.fitActiveElement(bounds)
          expect(wrapperInstance.MapElement.fitBounds).toHaveBeenCalledWith(bounds)
        })

        it('should pan to the element when the zoom level is within range', () => {
          wrapperInstance.MapElement.getBoundsZoom.mockImplementation(() => 12)
          wrapperInstance.fitActiveElement(bounds)
          expect(wrapperInstance.MapElement.panInsideBounds).toHaveBeenCalledWith(bounds)
        })

        it('should not pan to the element when the map bounds represent a point', () => {
          wrapperInstance.MapElement.getNorthEast.mockImplementation(() => [1, 1])
          wrapperInstance.MapElement.getSouthWest.mockImplementation(() => [1, 1])
          wrapperInstance.fitActiveElement(bounds)
          expect(wrapperInstance.MapElement.fitBounds).not.toHaveBeenCalled()
          expect(wrapperInstance.MapElement.panInsideBounds).toHaveBeenCalledWith(bounds)
        })
      })
    })

    describe('loading events', () => {
      it('should change the state when the loading event is triggerd', () => {
        const layer = {
          leafletId: 'id',
        }
        wrapperInstance.handleLoading(layer)
        expect(wrapperInstance.state.pendingLayers.length).toBe(1)
      })

      it('should add a layer to the pending changes only once when the loading event is triggerd', () => {
        const layer = {
          leafletId: 'id',
        }
        wrapperInstance.handleLoading(layer)
        wrapperInstance.handleLoading(layer)
        expect(wrapperInstance.state.pendingLayers.length).toBe(1)
      })

      it('should remove the layer from the pending layers when the loaded event is triggerd', () => {
        const layer = {
          leafletId: 'id',
        }
        wrapperInstance.handleLoading(layer)
        expect(wrapperInstance.state.pendingLayers.length).toBe(1)
        wrapperInstance.handleLoaded(layer)
        expect(wrapperInstance.state.pendingLayers.length).toBe(0)
      })
    })
  })
})
