import {
  currentShape,
  disable,
  drawTool,
  enable,
  cancel,
  initialize,
  setPolygon,
  handleDrawEvent,
  isDrawingActive,
  createPolygon,
  finishPolygon,
  autoClose,
  enforceLimits,
  updateShape,
  destroy,
} from './draw-tool'
import drawToolConfig from './draw-tool.config'
import { isBusy, start } from '../suppress/suppress'

jest.mock('../suppress/suppress')

describe('draw-tool service', () => {
  let leafletOld
  let domEventStopMock
  let addClassMock
  let enableTextSelectionMock
  let drawPolygonMock
  let editToolbarMock
  let featureGroupMock
  let geodesicAreaMock
  let readableAreaMock
  let formattedNumberMock
  let polygonMock

  const mockLeaflet = () => {
    domEventStopMock = jest.fn()
    addClassMock = jest.fn()
    enableTextSelectionMock = jest.fn()
    drawPolygonMock = jest.fn()
    editToolbarMock = class EditToolbar {
      // eslint-disable-next-line class-methods-use-this
      getModeHandlers() {
        return [
          {
            handler: {},
          },
        ]
      }
    }
    featureGroupMock = jest.fn()
    geodesicAreaMock = jest.fn()
    readableAreaMock = jest.fn()
    formattedNumberMock = jest.fn()
    polygonMock = jest.fn()

    return {
      DomEvent: {
        stop: domEventStopMock,
      },
      DomUtil: {
        addClass: addClassMock,
        enableTextSelection: enableTextSelectionMock,
      },
      Draw: {
        Event: {
          DRAWSTART: 'DRAWSTART',
          DRAWVERTEX: 'DRAWVERTEX',
          CREATED: 'CREATED',
          EDITSTART: 'EDITSTART',
          EDITVERTEX: 'EDITVERTEX',
          EDITSTOP: 'EDITSTOP',
          DELETED: 'DELETED',
        },
        Polygon: drawPolygonMock,
      },
      drawLocal: {
        format: 'mock-format',
        edit: {
          handlers: {
            edit: {
              tooltip: {
                text: '',
                subtext: '',
              },
            },
          },
        },
      },
      EditToolbar: editToolbarMock,
      FeatureGroup: featureGroupMock,
      GeometryUtil: {
        geodesicArea: geodesicAreaMock,
        readableArea: readableAreaMock,
        formattedNumber: formattedNumberMock,
      },
      Polygon: polygonMock,
    }
  }

  beforeEach(() => {
    leafletOld = window.L
    window.L = mockLeaflet()
    document.body.innerHTML = '<div id="leafletMap"></div>'
  })

  afterEach(() => {
    window.L = leafletOld
    document.body.innerHTML = ''
  })

  describe('initialize', () => {
    it('sets up the leaflet components', () => {
      const leafletMap = {
        addLayer: jest.fn(),
        on: jest.fn(),
      }

      initialize(leafletMap)

      expect(currentShape).toEqual({
        isConsistent: true,
        type: null,
        layer: null,
        layerPrev: null,
        markers: [],
        markersPrev: [],
        markersEdit: [],
        deleteMarker: {},
        markersMaxCount: drawToolConfig.MAX_MARKERS,
        area: 0,
        areaTxt: '',
        distance: 0,
        distanceTxt: '',
      })
      expect(window.L.drawLocal.format).toEqual({
        numeric: {
          delimiters: {
            thousands: '.',
            decimal: ',',
          },
        },
      })
      expect(featureGroupMock).toHaveBeenCalledTimes(1)
      expect(drawPolygonMock).toHaveBeenCalledTimes(1)
      expect(leafletMap.addLayer).toHaveBeenCalledTimes(1)

      // total of all draw events + 1 map click event + 1 layeradd event
      expect(leafletMap.on).toHaveBeenCalledTimes(Object.keys(window.L.Draw.Event).length + 2)
    })
  })

  describe('methods', () => {
    let layer
    const mapEventsOn = {}
    const mapEventsOff = {}
    let latLngsArray
    let latLngsPolygon

    beforeEach(() => {
      latLngsArray = [
        [52.374592413412294, 4.888771906266819],
        [52.374557014193066, 4.888724841471184],
        [52.37452381016258, 4.888778911181654],
        [52.37455608226589, 4.888835359085925],
      ]

      latLngsPolygon = latLngsArray.map((latLng) => ({
        lat: latLng[0],
        lng: latLng[1],
        distanceTo: jest.fn(() => 1),
      }))

      layer = {
        addLayer: jest.fn(),
        removeLayer: jest.fn(),
        bringToFront: jest.fn(),
        on: jest.fn(),
        off: jest.fn(),
        getLatLngs: jest.fn(() => [[{ lat: 2, lng: 2, distanceTo: jest.fn(() => 2) }]]),
        intersects: jest.fn(),
      }
      const onFinish = jest.fn()
      const onDrawingMode = jest.fn()
      const onUpdateShape = jest.fn()

      const leafletMap = {
        addLayer: jest.fn(),
        on: (name, handler) => {
          mapEventsOn[name] = handler
        },
        off: (name, handler) => {
          mapEventsOff[name] = handler
        },
        fire: jest.fn(),
      }

      initialize(leafletMap, onFinish, onDrawingMode, onUpdateShape)

      drawTool.drawShapeHandler = {
        ...drawTool.drawShapeHandler,
        _markers: [],
        enable: jest.fn(),
        disable: jest.fn(),
        completeShape: jest.fn(),
        deleteLastVertex: jest.fn(),
      }

      drawTool.editShapeHandler = {
        ...drawTool.editShapeHandler,
        enable: jest.fn(),
        disable: jest.fn(),
        save: jest.fn(),
      }
    })

    afterEach(() => {})

    describe('initialize', () => {
      it('should call setPolygon after the initalization', () => {
        const leafletMap = {
          addLayer: jest.fn(),
          on: jest.fn(),
        }

        const onFinish = jest.fn()
        const onDrawingMode = jest.fn()
        const onUpdateShape = jest.fn()

        jest.useFakeTimers()
        initialize(leafletMap, onFinish, onDrawingMode, onUpdateShape)

        // FF issue, the current shape changes in an separate thread
        currentShape.markers = []
        currentShape.markersPrev = [[1, 1]]
        currentShape.layer = layer
        currentShape.layer._path = 'classPath' // eslint-disable-line no-underscore-dangle
        jest.runAllTimers()
        expect(onUpdateShape).toHaveBeenCalledTimes(1)
      })
    })

    describe('distroy', () => {
      it('should deregister all mapevents', () => {
        drawTool.drawnItems = layer
        currentShape.layer = layer
        destroy()
        expect(currentShape.markers).toEqual([])
      })
    })

    describe('events', () => {
      describe('map events', () => {
        describe('click event', () => {
          beforeEach(() => {
            isBusy.mockImplementation(() => false)
          })

          it('should do nothing when the map is busy', () => {
            isBusy.mockImplementation(() => true)
            mapEventsOn.click()
            expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled()
          })

          it('should disable edit when in edit mode', () => {
            drawTool.drawingMode = drawToolConfig.DRAWING_MODE.EDIT
            mapEventsOn.click()
            expect(drawTool.editShapeHandler.disable).toHaveBeenCalledTimes(1)
          })

          it('should do nothing when mode is none and the current layer is null', () => {
            drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
            currentShape.layer = null
            mapEventsOn.click()
            expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled()
            expect(drawTool.editShapeHandler.disable).not.toHaveBeenCalled()
          })

          it('should delete the drawing when mode is none and the current layer is null', () => {
            drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
            currentShape.layer = layer
            drawTool.drawnItems = layer
            mapEventsOn.click()
            expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled()
            expect(drawTool.editShapeHandler.disable).not.toHaveBeenCalled()
          })
        })

        describe('layeradd event', () => {
          it('should bring the shape to front', () => {
            drawTool.drawnItems = layer

            mapEventsOn.layeradd()
            expect(drawTool.drawnItems.bringToFront).toHaveBeenCalled()
          })
        })
      })

      describe('draw events', () => {
        afterEach(() => {
          start.mockReset()
          enableTextSelectionMock.mockReset()
        })

        it('should call start on DELETED', () => {
          jest.useFakeTimers()
          mapEventsOn.DELETED()
          jest.runAllTimers()
          expect(start).toHaveBeenCalledWith(300)
          expect(enableTextSelectionMock).toHaveBeenCalledTimes(1)
        })

        it('should call onChangePolygon when drawing in not consistent', () => {
          jest.useFakeTimers()
          drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
          currentShape.isConsistent = false
          mapEventsOn.DRAWSTART()
          expect(start).not.toHaveBeenCalled()
          jest.runAllTimers()
          expect(enableTextSelectionMock).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('setPolygon', () => {
      it('should set an empty polygon', () => {
        // Arrange
        const emptyArray = []

        // Act
        setPolygon(emptyArray)

        // Assert
        expect(currentShape.markers).toEqual(emptyArray)
      })

      it('should setPolygon', () => {
        drawTool.drawnItems = layer
        layer.getLatLngs.mockImplementation(() => [latLngsPolygon])
        polygonMock.mockImplementation(() => ({ ...layer }))

        // Act
        setPolygon(latLngsArray)

        // Assert
        expect(currentShape.markers).toEqual(latLngsArray)
      })

      it('should replace the old polygon when setPolygon', () => {
        // Arrange
        latLngsPolygon = latLngsArray.map((latLng) => ({
          lat: latLng[0],
          lng: latLng[1],
          distanceTo: jest.fn(() => 1000),
        }))
        drawTool.drawnItems = layer
        layer.getLatLngs.mockImplementation(() => [latLngsPolygon])
        polygonMock.mockImplementation(() => ({ ...layer }))

        // Act
        setPolygon(latLngsArray)

        // Assert
        expect(currentShape.markers).toEqual(latLngsArray)

        // Act
        setPolygon([])

        expect(currentShape.markers).toEqual([])
      })
    })

    describe('createPolygon', () => {
      it('should toggle edit mode ', () => {
        drawTool.drawnItems = layer
        let eventHandler
        layer.on = (name, handler) => {
          eventHandler = handler
        }
        createPolygon(layer)
        const e = new Event('test-event')

        isBusy.mockImplementation(() => true)
        eventHandler(e)
        expect(domEventStopMock).not.toHaveBeenCalled()

        isBusy.mockImplementation(() => false)
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
        eventHandler(e)
        expect(domEventStopMock).toHaveBeenCalledWith(e)
        // expect(drawTool.drawShapeHandler.enable).toHaveBeenCalledTimes(1);

        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.EDIT
        mapEventsOn.click(e)
        expect(domEventStopMock).toHaveBeenCalledWith(e)
        // expect(drawTool.drawShapeHandler.disable).toHaveBeenCalledTimes(1);
      })
    })

    describe('finnishPolygon', () => {
      latLngsArray = [
        [52.3745924, 4.8887719],
        [52.374557, 4.8887248],
      ]
      latLngsPolygon = latLngsArray.map((latLng) => ({
        lat: latLng[0],
        lng: latLng[1],
        distanceTo: jest.fn(() => 1000),
      }))

      beforeEach(() => {
        layer.getLatLngs.mockImplementation(() => [latLngsPolygon])
        polygonMock.mockImplementation(() => ({ ...layer }))
        drawTool.drawnItems = layer
      })

      it('should restore the last shape when the current shape is not consistent', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.EDIT
        currentShape.isConsistent = false
        currentShape.markersPrev = latLngsArray

        finishPolygon()

        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.NONE)
        expect(currentShape.markers).toEqual(latLngsArray)
      })

      it('should create the polygon from the selected geometry from previous layer', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.DRAW
        currentShape.layerPrev = layer
        currentShape.markers = []

        finishPolygon()

        expect(currentShape.markers).toEqual(latLngsArray)
      })
    })

    describe('enforceLimits', () => {
      beforeEach(() => {
        layer.getLatLngs.mockImplementation(() => [latLngsPolygon])
        polygonMock.mockImplementation(() => ({ ...layer }))
        drawTool.drawnItems = layer
      })

      it('should restore the last shape when the current shape is not consistent', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.EDIT
        currentShape.isConsistent = false
        currentShape.markers = []
        currentShape.markersPrev = latLngsArray

        jest.useFakeTimers()
        enforceLimits()
        jest.runAllTimers()

        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.EDIT)
        expect(currentShape.markers).toEqual(latLngsArray)
      })
    })

    describe('autoClose', () => {
      it('should disable drawing mode when the markers count has reached maximum', () => {
        currentShape.markers = latLngsArray
        currentShape.markersMaxCount = 4
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.DRAW
        autoClose()
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.NONE)
      })
    })

    describe('enable', () => {
      it('should enable drawing when drawing mode is none', () => {
        enable()
        expect(drawTool.drawShapeHandler.enable).toHaveBeenCalledTimes(1)
      })

      it('should enable editing when drawing mode is none and shape already exists', () => {
        currentShape.layer = 'existing'
        enable()
        expect(drawTool.editShapeHandler.enable).toHaveBeenCalledTimes(1)
      })

      it('should do nothing when drawing mode is draw', () => {
        drawTool.drawingMode = 'draw'
        enable()
        expect(drawTool.editShapeHandler.enable).not.toHaveBeenCalled()
      })

      it('should do nothing when drawing mode is edit', () => {
        drawTool.drawingMode = 'edit'
        enable()
        expect(drawTool.editShapeHandler.enable).not.toHaveBeenCalled()
      })
    })

    describe('disable', () => {
      it('should disable drawing when drawing mode is draw', () => {
        drawTool.drawingMode = 'draw'
        disable()
        expect(drawTool.drawShapeHandler.disable).toHaveBeenCalledTimes(1)
      })

      it('should complete the shape when drawing mode is draw and shape already exists', () => {
        drawTool.drawingMode = 'draw'
        currentShape.markers = [1, 2]
        disable()
        expect(drawTool.drawShapeHandler.completeShape).toHaveBeenCalledTimes(1)
      })

      it('should save and disable drawing when drawing mode is edit', () => {
        drawTool.drawingMode = 'edit'
        disable()
        expect(drawTool.editShapeHandler.save).toHaveBeenCalledTimes(1)
        expect(drawTool.editShapeHandler.disable).toHaveBeenCalledTimes(1)
      })

      it('should do nothing when drawing mode is none', () => {
        disable()
        expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled()
        expect(drawTool.drawShapeHandler.completeShape).not.toHaveBeenCalled()
        expect(drawTool.editShapeHandler.save).not.toHaveBeenCalled()
        expect(drawTool.editShapeHandler.disable).not.toHaveBeenCalled()
      })
    })

    describe('cancel', () => {
      it('should do nothing drawing when drawing mode is none', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
        cancel()
        expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled()
        expect(drawTool.editShapeHandler.disable).not.toHaveBeenCalled()
      })

      it('should cancel drawing when drawing mode is draw', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.DRAW
        cancel()
        expect(drawTool.drawShapeHandler.disable).toHaveBeenCalledTimes(1)
        expect(drawTool.editShapeHandler.disable).not.toHaveBeenCalled()
      })

      it('should cancel drawing when drawing mode is edit', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.EDIT
        cancel()
        expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled()
        expect(drawTool.editShapeHandler.disable).toHaveBeenCalledTimes(1)
      })
    })

    describe('updateShape ', () => {
      it('should use the edit markers when editing the drawing', () => {
        currentShape.markersEdit = latLngsPolygon
        currentShape.layer = null
        updateShape()
        expect(currentShape.markers).toEqual(latLngsArray)
      })

      it('should update the empty shape ', () => {
        currentShape.markersEdit = []
        currentShape.layer = null
        updateShape()
        expect(currentShape.markers).toEqual([])
      })
    })

    describe('handleDrawEvent', () => {
      beforeEach(() => {
        currentShape.markers = latLngsArray
        currentShape.markersEdit = []
        currentShape.markersPrev = latLngsArray
        currentShape.layer = layer
        currentShape.layerPrev = layer
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.DRAW
        drawTool.drawnItems = layer
        latLngsPolygon = latLngsArray.map((latLng) => ({
          lat: latLng[0],
          lng: latLng[1],
          distanceTo: jest.fn(() => 1),
        }))
        drawTool.drawnItems = layer
        layer.getLatLngs.mockImplementation(() => [latLngsPolygon])
        polygonMock.mockImplementation(() => ({ ...layer }))
      })

      it('should handle the DRAWSTART event', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
        handleDrawEvent('DRAWSTART')
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.DRAW)

        handleDrawEvent('DRAWSTART')
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.DRAW)
      })

      it('should handle the DRAWSTOP event', () => {
        handleDrawEvent('DRAWSTOP')
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.NONE)
      })

      describe('DRAWVERTEX event', () => {
        const eventHandler = {}
        beforeEach(() => {
          layer.on = (name, handler) => {
            eventHandler[name] = handler
          }
        })

        it('should do nothing when first marker', () => {
          drawTool.drawShapeHandler._markers = [layer] // eslint-disable-line no-underscore-dangle
          handleDrawEvent('DRAWVERTEX')

          // expect(layer.on).toHaveBeenCalledTimes(2);
          const oldMarkers = currentShape.markers
          drawTool.drawShapeHandler.enabled = () => true
          eventHandler.click()
          expect(currentShape.deleteMarker).toEqual({})
          expect(currentShape.markers).toEqual(oldMarkers)
        })

        it('should initialize the polygon when is first marker and contains only one marker', () => {
          const marker = {
            ...layer,
            _latlng: { lat: 1, lng: 1 },
          }
          drawTool.drawShapeHandler._markers = [marker] // eslint-disable-line no-underscore-dangle
          currentShape.markers = [currentShape.markers.pop()]
          latLngsPolygon = currentShape.markers.map((latLng) => ({
            lat: latLng[0],
            lng: latLng[1],
            distanceTo: jest.fn(() => 1),
          }))
          drawTool.drawnItems = layer
          layer.getLatLngs.mockImplementation(() => [latLngsPolygon])
          handleDrawEvent('DRAWVERTEX')

          drawTool.drawShapeHandler.enabled = () => true
          eventHandler.click()
          expect(currentShape.deleteMarker).toEqual(marker)
          expect(currentShape.markers).toEqual([[1, 1]])
        })

        it('should delete the marker when this is not the first one', () => {
          // eslint-disable-next-line no-underscore-dangle
          drawTool.drawShapeHandler._markers = [
            // eslint-disable-line no-underscore-dangle
            {},
            { ...layer, _latlng: { lat: 1, lng: 1 } },
          ]
          handleDrawEvent('DRAWVERTEX')

          drawTool.drawShapeHandler.enabled = () => true
          const oldMarkers = currentShape.markers
          eventHandler.click()
          expect(currentShape.deleteMarker).toEqual(
            drawTool.drawShapeHandler._markers[1], // eslint-disable-line no-underscore-dangle
          )
          expect(currentShape.markers).toEqual(oldMarkers)
        })
      })

      it('should handle the CREATED event', () => {
        handleDrawEvent('CREATED', { layer })
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.NONE)
      })

      it('should handle the EDITSTART event', () => {
        drawTool.drawingMode = drawToolConfig.DRAWING_MODE.NONE
        handleDrawEvent('EDITSTART')
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.EDIT)
      })

      describe('EDITVERTEX event', () => {
        it('should add the selected vertex to the markers edit', () => {
          const latLng = [52, 4]
          const vertex = {
            poly: {
              _latlngs: [latLng],
            },
          }
          handleDrawEvent('EDITVERTEX', vertex)
          expect(currentShape.markersEdit).toEqual(latLng)
        })
      })

      it('should handle the EDITSTOP event', () => {
        handleDrawEvent('EDITSTOP')
        expect(drawTool.drawingMode).toEqual(drawToolConfig.DRAWING_MODE.NONE)
      })

      it('should handle the DELETED event', () => {
        handleDrawEvent('DELETED')
        expect(currentShape.layer).toBeFalsy()
      })
    })

    describe('isDrawingActive', () => {
      it('should return false when drawing mode is none', () => {
        expect(isDrawingActive(drawToolConfig.DRAWING_MODE.NONE)).toBeFalsy()
      })

      it('should return true when drawing mode is draw', () => {
        expect(isDrawingActive(drawToolConfig.DRAWING_MODE.DRAW)).toBeTruthy()
      })

      it('should return true when drawing mode is edit', () => {
        expect(isDrawingActive(drawToolConfig.DRAWING_MODE.EDIT)).toBeTruthy()
      })
    })
  })
})
