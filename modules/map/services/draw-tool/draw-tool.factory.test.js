describe('The draw tool factory', function () {
    let $rootScope,
        L,
        DRAW_TOOL_CONFIG,
        drawTool,
        leafletMap;

    let layerGroup,
        drawnItems,
        drawShapeHandler,
        editShapeHandler,
        modeHandlers,
        editToolbar,
        geometryUtil;

    let testMarkers;

    beforeEach(function () {
        testMarkers = [[4, 50], [4, 51], [3, 51], [3, 50], [0, 0], [0, 0]];

        layerGroup = {
            addLayer: angular.noop
        };

        drawnItems = {
            addLayer: angular.noop,
            removeLayer: angular.noop
        };

        editShapeHandler = {
            enabled: angular.noop,
            enable: angular.noop,
            disable: angular.noop,
            save: angular.noop
        };

        modeHandlers = [{
            handler: editShapeHandler
        }];

        editToolbar = {
            getModeHandlers: () => modeHandlers
        };

        drawShapeHandler = {
            enabled: angular.noop,
            deleteLastVertex: angular.noop,
            completeShape: angular.noop,
            disable: angular.noop,
            enable: angular.noop
        };

        geometryUtil = {
            // geodesicArea: () => 1,
            // readableArea: () => 1,
            // readableDistance: () => 1
        };

        angular.mock.module(
            'dpMap',
            {
                L: {
                    LayerGroup: () => layerGroup,
                    FeatureGroup: () => drawnItems,
                    EditToolbar: () => editToolbar,
                    GeometryUtil: geometryUtil,
                    Polygon: angular.noop,
                    Draw: {
                        Polygon: () => drawShapeHandler
                    },
                    DomEvent: {
                        stop: angular.noop
                    }
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _L_, _DRAW_TOOL_CONFIG_, _drawTool_) {
            $rootScope = _$rootScope_;
            L = _L_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
            drawTool = _drawTool_;
        });

        DRAW_TOOL_CONFIG.MAX_MARKERS = 4;

        leafletMap = {
            addLayer: angular.noop,
            on: angular.noop,
            fire: angular.noop
        };

        // spyOn(L, 'LayerGroup').and.returnValue(layerGroup);
        spyOn(L, 'FeatureGroup').and.returnValue(drawnItems);
        spyOn(L, 'EditToolbar').and.returnValue(editToolbar);
        spyOn(L.Draw, 'Polygon').and.returnValue(drawShapeHandler);
        spyOn(L.DomEvent, 'stop');
        spyOn(leafletMap, 'addLayer');
        spyOn(leafletMap, 'on');
        // spyOn(leafletMap, 'fire');
        // spyOn(layerGroup, 'addLayer');
        spyOn(drawnItems, 'addLayer');
        spyOn(drawnItems, 'removeLayer');
        spyOn(drawShapeHandler, 'enabled');
        spyOn(drawShapeHandler, 'deleteLastVertex');
        spyOn(drawShapeHandler, 'completeShape');
        spyOn(drawShapeHandler, 'enable');
        spyOn(drawShapeHandler, 'disable');
        // spyOn(editToolbar, 'getModeHandlers').and.returnValue(modeHandlers);
        // spyOn(editShapeHandler, 'enabled');
        spyOn(editShapeHandler, 'enable');
        spyOn(editShapeHandler, 'disable');
        spyOn(editShapeHandler, 'save');
    });

    // Events
    // 'draw:created'
    // 'draw:edited'
    // 'draw:deleted'
    // 'draw:drawstart'
    // 'draw:drawstop'
    // 'draw:drawvertex'
    // 'draw:editstart'
    // 'draw:editmove'
    // 'draw:editresize'
    // 'draw:editvertex'
    // 'draw:editstop'
    // 'draw:deletestart'
    // 'draw:deletestop'
    // 'click'

    function fireEvent (name, e) {
        let handlers = {};

        for (let i = 0; i < leafletMap.on.calls.count(); i++) {
            let [fname, func] = leafletMap.on.calls.argsFor(i);
            handlers[fname] = func;
        }

        if (handlers[name]) {
            handlers[name](e);
        }

        $rootScope.$digest();
    }

    describe('Initialisation', function () {
        beforeEach(function () {
            drawTool.initialize(leafletMap);
        });

        it('is disabled by default', function () {
            expect(drawTool.isEnabled()).toBe(false);
        });

        it('can be enabled', function () {
            drawTool.enable();
            expect(drawShapeHandler.enable).toHaveBeenCalled();

            fireEvent('draw:drawstart');
            expect(drawTool.isEnabled()).toBe(true);
        });

        it('ignores enable() when already enabled', function () {
            drawTool.enable();
            fireEvent('draw:drawstart');
            drawShapeHandler.enable.calls.reset();

            drawTool.enable();
            expect(drawShapeHandler.enable).not.toHaveBeenCalled();
        });

        it('can be disabled', function () {
            drawTool.enable();
            fireEvent('draw:drawstart');

            drawTool.disable();
            expect(drawTool.isEnabled()).toBe(false);
        });

        it('ignores disable() when already disabled', function () {
            drawTool.disable();
            expect(drawShapeHandler.disable).not.toHaveBeenCalled();
        });
    });

    describe('On drawing mode changed event', function () {
        let onResult,
            onDrawingMode = status => onResult = status;

        beforeEach(function () {
            drawTool.initialize(leafletMap, null, onDrawingMode);
        });

        it('calls onDrawing when the drawing mode changes, in the next digest cycle', function () {
            drawTool.enable();
            fireEvent('draw:drawstart');
            $rootScope.$digest();

            expect(onResult).toBe(true);
        });
    });

    describe('Draw polygon', function () {
        let nVertices,
            vertices;

        beforeEach(function () {
            nVertices = 3;

            spyOn(L.GeometryUtil, 'readableArea').and.returnValue(1);
            spyOn(L.GeometryUtil, 'readableDistance').and.returnValue(1);
            spyOn(L.GeometryUtil, 'geodesicArea').and.returnValue(1);

            vertices = testMarkers.map(([lat, lng], i) => {
                return {
                    _leaflet_id: i,
                    handler: {},
                    _latlng: {
                        lat,
                        lng,
                        distanceTo: () => 1
                    }
                };
            });

            vertices.forEach(v => {
                v.on = (on, func) => v.handler[on] = func;
            });
        });

        function enable () {
            drawTool.enable();
            fireEvent('draw:drawstart');
        }

        function addVertices () {
            let markers = [];
            for (let i = 0; i < nVertices; i++) {
                let v = vertices[i];
                markers.push(v);
                drawShapeHandler._markers = markers;
                fireEvent('draw:drawvertex');
            }
        }

        function buildPolygon () {
            enable();

            addVertices();

            fireEvent('draw:drawstop');
            fireEvent('draw:deleted');  // this is the event that leaflet fires after drawstop
        }

        class Layer {
            constructor (latlngs) {
                this._latlngs = [];
                latlngs.forEach(latlng => this.addVertex(latlng));
            }

            addVertex (latlng) {
                let [lat, lng] = latlng;
                this._latlngs.push({
                    lat,
                    lng,
                    distanceTo: () => 1
                });
            }

            on () { }   // shape click handler

            off () { }

            getLatLngs () {
                return [this._latlngs];
            }

            intersects () { return false; }
        }

        let shapeClickHandler = {};

        let layer = {
            on: (event, handler) => shapeClickHandler[event] = handler,
            off: angular.noop,
            getLatLngs: () => [vertices.map(v => v._latlng).slice(0, nVertices)],
            intersects: () => false
        };

        function createPolygon () {
            buildPolygon();
            fireEvent('draw:created', {
                layer
            });
        }

        function deletePolygon () {
            drawTool.setPolygon([]);
            drawShapeHandler._markers = [];
            fireEvent('draw:deleted');
        }

        beforeEach(function () {
            drawTool.initialize(leafletMap);
        });

        it('Can add a vertex', function () {
            enable();
            drawShapeHandler._markers = [vertices[0]];
            fireEvent('draw:drawvertex');

            expect(drawTool.shape.markers).toEqual(testMarkers.slice(0, 1));
        });

        it('Can build a polygon', function () {
            drawTool.initialize(leafletMap);
            buildPolygon();

            expect(drawTool.shape.markers).toEqual(testMarkers.slice(0, nVertices));
        });

        it('Can build a line', function () {
            enable();

            nVertices = 2;
            addVertices();

            expect(drawTool.shape.markers).toEqual(testMarkers.slice(0, nVertices));
            expect(drawTool.isEnabled()).toBe(true);

            drawShapeHandler.enabled = () => true;
            vertices[0].handler.click();

            expect(drawShapeHandler.completeShape).toHaveBeenCalled();

            drawShapeHandler.enabled = () => false;

            fireEvent('draw:created', {layer});
            fireEvent('draw:drawstop');

            expect(drawTool.shape.markers).toEqual(testMarkers.slice(0, nVertices));
            expect(drawTool.isEnabled()).toBe(false);
        });

        it('Can build a polygon and notifies info on shape on finish drawing', function () {
            let onResult,
                onFinish = shape => onResult = shape;

            drawTool.initialize(leafletMap, onFinish);
            buildPolygon();

            fireEvent('draw:created', {layer});

            expect(onResult.markers).toEqual(testMarkers.slice(0, nVertices));
            expect(drawTool.shape.distance).toBe(nVertices);
            expect(drawTool.shape.area).toBe(1);
        });

        it('Can delete a polygon', function () {
            createPolygon();

            deletePolygon();

            expect(drawTool.shape.markers).toEqual([]);
        });

        it('Can delete the last marker', function () {
            enable();

            addVertices();

            vertices[2].handler.click();

            expect(drawShapeHandler.deleteLastVertex).toHaveBeenCalled();
        });

        it('Can delete the first marker', function () {
            nVertices = 1;

            enable();
            drawShapeHandler.enabled = () => true;

            addVertices();

            drawShapeHandler.disable.calls.reset();
            drawShapeHandler.enable.calls.reset();

            vertices[0].handler.click();

            expect(drawShapeHandler.disable).toHaveBeenCalled();
            expect(drawShapeHandler.enable).toHaveBeenCalled();
        });

        it ('Auto closes a polygon', function () {
            enable();

            nVertices = 4;
            addVertices();

            expect(drawTool.isEnabled()).toBe(false);
            expect(drawTool.shape.markers.length).toBe(4);
        });

        it('can edit a polygon by clicking the drawn polygon', function () {
            createPolygon();

            expect(shapeClickHandler.click).toEqual(jasmine.any(Function));

            shapeClickHandler.click();

            expect(editShapeHandler.enable).toHaveBeenCalled();
            fireEvent('draw:editstart');

            shapeClickHandler.click();

            expect(editShapeHandler.save).toHaveBeenCalled();
            expect(editShapeHandler.disable).toHaveBeenCalled();
        });

        it('can edit a polygon by enabling the draw tool', function () {
            createPolygon();

            drawTool.enable();
            expect(editShapeHandler.enable).toHaveBeenCalled();

            fireEvent('draw:editstart');

            drawTool.disable();

            expect(editShapeHandler.save).toHaveBeenCalled();
            expect(editShapeHandler.disable).toHaveBeenCalled();
        });

        it('can add markers to a polygon in edit mode', function () {
            createPolygon();

            drawTool.enable();
            fireEvent('draw:editstart');

            nVertices = 4;  // layer.getLatlngs() response

            fireEvent('draw:editstop');
            expect(drawTool.shape.markers.length).toBe(4);
        });

        it('does not let a polygon exceed max markers in edit mode', function () {
            L.Polygon = Layer;

            drawShapeHandler.disable.and.callFake(() => fireEvent('draw:drawstop'));

            drawTool.enable();
            fireEvent('draw:drawstart');

            nVertices = DRAW_TOOL_CONFIG.MAX_MARKERS;
            addVertices();

            expect(drawShapeHandler.completeShape).toHaveBeenCalled();
            expect(drawTool.isEnabled()).toBe(false);
            expect(drawTool.shape.markers.length).toBe(4);

            fireEvent('draw:created', {
                layer
            });
            fireEvent('draw:drawstop');

            expect(drawTool.shape.markers.length).toBe(4);

            drawTool.enable();
            fireEvent('draw:editstart');

            expect(editShapeHandler.enable).toHaveBeenCalled();

            nVertices = 5;  // layer.getLatlngs() response
            fireEvent('draw:editvertex');

            expect(drawTool.shape.markers.length).toBe(4);
        });

        it('click on map while drawing polygon does not end draw mode', function () {
            enable();

            addVertices();

            expect(drawTool.isEnabled()).toBe(true);

            fireEvent('click');

            expect(drawTool.isEnabled()).toBe(true);
        });

        it('click on map while finished drawing polygon deletes polygon', function () {
            createPolygon();

            drawShapeHandler._markers = []; // edit mode, no markers in draw mode

            fireEvent('click');

            expect(drawTool.isEnabled()).toBe(false);
            expect(drawTool.shape.markers.length).toBe(0);
        });

        it('click on map while editing polygon ends edit mode', function () {
            createPolygon();

            drawTool.enable();
            fireEvent('draw:editstart');

            fireEvent('click');

            expect(drawTool.isEnabled()).toBe(false);
            expect(drawTool.shape.markers.length).toBe(nVertices);
        });
    });

    describe('Set polygon', function () {
        beforeEach(function () {
            drawTool.initialize(leafletMap);
        });

        it('does not create a new polygon for empty markers', function () {
            drawTool.setPolygon([]);

            expect(drawnItems.addLayer).not.toHaveBeenCalled();
            expect(drawTool.shape.markers.length).toBe(0);
        });

        it('creates a new polygon for the specified markers', function () {
            let markers = testMarkers.slice(0, 3);
            drawTool.setPolygon(markers);

            expect(drawnItems.addLayer).toHaveBeenCalled();
            expect(drawTool.shape.markers.length).toBe(3);
        });

        it('deletes any existing polygon', function () {
            let markers = testMarkers.slice(0, 3);
            drawTool.setPolygon(markers);

            drawnItems.addLayer.calls.reset();

            drawTool.setPolygon([]);

            expect(drawnItems.addLayer).not.toHaveBeenCalled();
            expect(drawTool.shape.markers.length).toBe(0);
        });
    });
});
