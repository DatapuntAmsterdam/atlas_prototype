/* global L */
import {
  initialize,
  enable,
  disable,
  currentShape,
  drawTool
} from './draw-tool';

import {
  MAX_MARKERS
} from './draw-tool-config';

const MAP_OPTIONS = {};

let leafletMap;
let leafletOld;
let domEventStopMock;
let addClassMock;
let enableTextSelectionMock;
let drawPolygonMock;
let editToolbarMock;
let featureGroupMock;
let geodesicAreaMock;
let readableAreaMock;
let formattedNumberMock;
let polygonMock;

describe('Draw-tool service', () => {
  describe('initialize', () => {
    beforeEach(() => {
      leafletMap = {
        addLayer: jest.fn(),
        on: jest.fn()
      };

      domEventStopMock = jest.fn();
      addClassMock = jest.fn();
      enableTextSelectionMock = jest.fn();
      drawPolygonMock = jest.fn();
      editToolbarMock = () => ({
        getModeHandlers: () => [{
          handler: 'mock-handler'
        }]
      });
      featureGroupMock = jest.fn();
      geodesicAreaMock = jest.fn();
      readableAreaMock = jest.fn();
      formattedNumberMock = jest.fn();
      polygonMock = jest.fn();

      leafletOld = window.L;
      window.L = {
        DomEvent: {
          stop: domEventStopMock
        },
        DomUtil: {
          addClass: addClassMock,
          enableTextSelection: enableTextSelectionMock
        },
        Draw: {
          Event: {
            DRAWSTART: jest.fn(),
            DRAWVERTEX: jest.fn(),
            CREATED: jest.fn(),
            EDITSTART: jest.fn(),
            EDITVERTEX: jest.fn(),
            EDITSTOP: jest.fn(),
            DELETED: jest.fn()
          },
          Polygon: drawPolygonMock
        },
        drawLocal: {
          format: 'mock-format',
          edit: {
            handlers: {
              edit: {
                tooltip: {
                  text: '',
                  subtext: ''
                }
              }
            }
          }
        },
        EditToolbar: editToolbarMock,
        FeatureGroup: featureGroupMock,
        GeometryUtil: {
          geodesicArea: geodesicAreaMock,
          readableArea: readableAreaMock,
          formattedNumber: formattedNumberMock
        },
        Polygon: polygonMock
      };
      document.body.innerHTML = '<div id="leafletMap"></div>';
    });

    afterEach(() => {
      window.L = leafletOld;
    });

    it('sets up the leaflet components', () => {
      initialize(leafletMap);

      expect(currentShape).toEqual({
        isConsistent: true,
        type: null,
        layer: null,
        markers: [],
        markersPrev: [],
        markersEdit: [],
        deleteMarker: {},
        markersMaxCount: MAX_MARKERS,
        area: 0,
        areaTxt: '',
        distance: 0,
        distanceTxt: ''
      });
      expect(window.L.drawLocal.format).toEqual({
        numeric: {
          delimiters: {
            thousands: '.',
            decimal: ','
          }
        }
      });
      expect(featureGroupMock).toHaveBeenCalledTimes(1);
      expect(drawPolygonMock).toHaveBeenCalledTimes(1);
      expect(editToolbarMock().getModeHandlers()[0].handler).toBe('mock-handler');
      expect(leafletMap.addLayer).toHaveBeenCalledTimes(1);

      // total of all draw events + 1 map click event
      expect(leafletMap.on).toHaveBeenCalledTimes(Object.keys(window.L.Draw.Event).length + 1);
    });
  });
});

describe('methods', () => {
  beforeEach(() => {
    const onFinish = jest.fn();
    const onDrawingMode = jest.fn();
    const onUpdateShape = jest.fn();

    document.body.innerHTML = '<div id="leafletMap"></div>';
    leafletMap = L.map(document.getElementById('leafletMap'), MAP_OPTIONS);

    initialize(leafletMap, onFinish, onDrawingMode, onUpdateShape);

    drawTool.drawShapeHandler.enable = jest.fn();
    drawTool.drawShapeHandler.disable = jest.fn();
    drawTool.drawShapeHandler.completeShape = jest.fn();
    drawTool.editShapeHandler.enable = jest.fn();
    drawTool.editShapeHandler.disable = jest.fn();
    drawTool.editShapeHandler.save = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('enable', () => {
    it('should enable drawing when drawing mode is none', () => {
      enable();
      expect(drawTool.drawShapeHandler.enable).toHaveBeenCalledTimes(1);
    });

    it('should enable editing when drawing mode is none and shape already exists', () => {
      currentShape.layer = 'existing';
      enable();
      expect(drawTool.editShapeHandler.enable).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when drawing mode is draw', () => {
      drawTool.drawingMode = 'draw';
      enable();
      expect(drawTool.editShapeHandler.enable).not.toHaveBeenCalled();
    });

    it('should do nothing when drawing mode is edit', () => {
      drawTool.drawingMode = 'edit';
      enable();
      expect(drawTool.editShapeHandler.enable).not.toHaveBeenCalled();
    });
  });

  describe('disable', () => {
    it('should disable drawing when drawing mode is draw', () => {
      drawTool.drawingMode = 'draw';
      disable();
      expect(drawTool.drawShapeHandler.disable).toHaveBeenCalledTimes(1);
    });

    it('should complete the shape when drawing mode is draw and shape already exists', () => {
      drawTool.drawingMode = 'draw';
      currentShape.markers = [1, 2];
      disable();
      expect(drawTool.drawShapeHandler.completeShape).toHaveBeenCalledTimes(1);
    });

    it('should save and disable drawing when drawing mode is edit', () => {
      drawTool.drawingMode = 'edit';
      disable();
      expect(drawTool.editShapeHandler.save).toHaveBeenCalledTimes(1);
      expect(drawTool.editShapeHandler.disable).toHaveBeenCalledTimes(1);
    });

    it('should do nothing when drawing mode is none', () => {
      disable();
      expect(drawTool.drawShapeHandler.disable).not.toHaveBeenCalled();
      expect(drawTool.drawShapeHandler.completeShape).not.toHaveBeenCalled();
      expect(drawTool.editShapeHandler.save).not.toHaveBeenCalled();
      expect(drawTool.editShapeHandler.disable).not.toHaveBeenCalled();
    });
  });
});
