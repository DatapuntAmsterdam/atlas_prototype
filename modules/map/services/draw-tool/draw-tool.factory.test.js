describe('The draw tool factory', () => {
    let store,
        ACTIONS,
        L,
        drawTool,
        DRAW_TOOL_CONFIG,
        map,
        layerGroup,
        drawnItems,
        drawShapeHandler,
        editToolbar,
        editShapeHandler,
        modeHandlers;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    getState: angular.noop,
                    subscribe: angular.noop,
                    dispatch: angular.noop
                },
                L: {
                    LayerGroup: angular.noop,
                    FeatureGroup: angular.noop,
                    EditToolbar: angular.noop,
                    Draw: {
                        Polygon: angular.noop
                    },
                    DomEvent: {
                        stop: angular.noop
                    }
                }
            }
        );

        angular.mock.inject((_store_, _L_, _drawTool_, _DRAW_TOOL_CONFIG_, _ACTIONS_) => {
            store = _store_;
            L = _L_;
            drawTool = _drawTool_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
            ACTIONS = _ACTIONS_;
        });

        map = {
            addLayer: angular.noop,
            on: angular.noop,
            fire: angular.noop
        };

        layerGroup = {
            addLayer: angular.noop
        };

        drawnItems = {
            addLayer: angular.noop,
            removeLayer: angular.noop
        };

        drawShapeHandler = {
            enabled: angular.noop,
            deleteLastVertex: angular.noop,
            completeShape: angular.noop,
            disable: angular.noop,
            enable: angular.noop
        };

        editToolbar = {
            getModeHandlers: angular.noop
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

        spyOn(store, 'getState');
        spyOn(store, 'subscribe');
        spyOn(store, 'dispatch');
        spyOn(L, 'LayerGroup').and.returnValue(layerGroup);
        spyOn(L, 'FeatureGroup').and.returnValue(drawnItems);
        spyOn(L, 'EditToolbar').and.returnValue(editToolbar);
        spyOn(L.Draw, 'Polygon').and.returnValue(drawShapeHandler);
        spyOn(L.DomEvent, 'stop');
        spyOn(map, 'addLayer');
        spyOn(map, 'on');
        spyOn(map, 'fire');
        spyOn(layerGroup, 'addLayer');
        spyOn(drawnItems, 'addLayer');
        spyOn(drawnItems, 'removeLayer');
        spyOn(drawShapeHandler, 'enabled');
        spyOn(drawShapeHandler, 'deleteLastVertex');
        spyOn(drawShapeHandler, 'completeShape');
        spyOn(drawShapeHandler, 'disable');
        spyOn(drawShapeHandler, 'enable');
        spyOn(editToolbar, 'getModeHandlers').and.returnValue(modeHandlers);
        spyOn(editShapeHandler, 'enabled');
        spyOn(editShapeHandler, 'enable');
        spyOn(editShapeHandler, 'disable');
        spyOn(editShapeHandler, 'save');

        drawTool.initialize(map);
    });

    it('subscribes to the store', () => {
        expect(store.subscribe).toHaveBeenCalledTimes(1);
        expect(store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('creates a draw handler', () => {
        expect(L.FeatureGroup).toHaveBeenCalledTimes(1);
        expect(L.Draw.Polygon).toHaveBeenCalledTimes(1);
        expect(L.Draw.Polygon).toHaveBeenCalledWith(map, DRAW_TOOL_CONFIG.draw.polygon);
    });

    it('creates an edit handler', () => {
        let editConfig = angular.copy(DRAW_TOOL_CONFIG.edit);
        editConfig.featureGroup = drawnItems;

        expect(L.EditToolbar).toHaveBeenCalledTimes(1);
        expect(L.EditToolbar).toHaveBeenCalledWith(editConfig);
        expect(editToolbar.getModeHandlers).toHaveBeenCalledTimes(1);
        expect(editToolbar.getModeHandlers).toHaveBeenCalledWith(map);
    });

    it('adds a new layer to the map', () => {
        expect(map.addLayer).toHaveBeenCalledWith(drawnItems);
    });

    it('will bind four events to the map', () => {
        expect(map.on).toHaveBeenCalledTimes(4);
    });

    describe('enabling and disabling', () => {
        let subscriptionHandler;
        let state;

        beforeEach(() => {
            subscriptionHandler = store.subscribe.calls.first().args[0];
            state = {
                map: {
                    drawingMode: undefined
                }
            };
            store.getState.and.returnValue(state);
        });

        it('is disabled by default', () => {
            expect(drawShapeHandler.enable).not.toHaveBeenCalled();
            expect(drawShapeHandler.disable).not.toHaveBeenCalled();
            expect(editShapeHandler.enable).not.toHaveBeenCalled();
            expect(editShapeHandler.disable).not.toHaveBeenCalled();
        });

        ['DRAW', 'EDIT', true].forEach((drawingMode) => {
            it(`enables the drawing tool when the drawing mode in the state is set to ${drawingMode}`, () => {
                drawShapeHandler.enabled.and.returnValue(false);
                drawShapeHandler.enable.and.callFake(() => {
                    drawShapeHandler.enabled.and.returnValue(true);
                });
                editShapeHandler.enabled.and.returnValue(false);
                state.map.drawingMode = drawingMode;

                subscriptionHandler();

                expect(drawShapeHandler.enable).toHaveBeenCalledTimes(1);

                // It knows to go into DRAW mode, since it has no polygon yet
                // and updates the state accordingly
                expect(store.dispatch).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.MAP_SET_DRAWING_MODE,
                    payload: 'DRAW'
                });

                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.enable).not.toHaveBeenCalled();
                expect(editShapeHandler.disable).not.toHaveBeenCalled();
            });
        });

        ['DRAW', 'EDIT', true].forEach((drawingMode) => {
            it(`leaves the drawing tool enabled when the drawing mode in the state is set to ${drawingMode}`, () => {
                // Drawing
                drawShapeHandler.enabled.and.returnValue(true);
                editShapeHandler.enabled.and.returnValue(false);
                state.map.drawingMode = drawingMode;

                subscriptionHandler();

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.enable).not.toHaveBeenCalled();
                expect(editShapeHandler.disable).not.toHaveBeenCalled();
                expect(store.dispatch).not.toHaveBeenCalled();

                // Editing
                drawShapeHandler.enable.calls.reset();
                drawShapeHandler.disable.calls.reset();
                editShapeHandler.enable.calls.reset();
                editShapeHandler.disable.calls.reset();
                store.dispatch.calls.reset();

                drawShapeHandler.enabled.and.returnValue(false);
                editShapeHandler.enabled.and.returnValue(true);
                state.map.drawingMode = drawingMode;

                subscriptionHandler();

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.enable).not.toHaveBeenCalled();
                expect(editShapeHandler.disable).not.toHaveBeenCalled();
                expect(store.dispatch).not.toHaveBeenCalled();
            });
        });

        [false, null, undefined].forEach((drawingMode) => {
            it(`disables the drawing tool when the drawing mode in the state is set to ${drawingMode}`, () => {
                // Drawing
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler.disable.and.callFake(() => {
                    drawShapeHandler.enabled.and.returnValue(false);
                });
                editShapeHandler.enabled.and.returnValue(false);
                state.map.drawingMode = drawingMode;

                subscriptionHandler();

                expect(drawShapeHandler.disable).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.MAP_SET_DRAWING_MODE,
                    payload: null
                });

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(editShapeHandler.enable).not.toHaveBeenCalled();
                expect(editShapeHandler.disable).not.toHaveBeenCalled();

                // Editing
                drawShapeHandler.enable.calls.reset();
                drawShapeHandler.disable.calls.reset();
                editShapeHandler.enable.calls.reset();
                editShapeHandler.disable.calls.reset();
                store.dispatch.calls.reset();

                drawShapeHandler.enabled.and.returnValue(false);
                editShapeHandler.enabled.and.returnValue(true);
                editShapeHandler.disable.and.callFake(() => {
                    editShapeHandler.enabled.and.returnValue(false);
                });
                state.map.drawingMode = drawingMode;

                subscriptionHandler();

                expect(editShapeHandler.disable).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.MAP_SET_DRAWING_MODE,
                    payload: null
                });

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.enable).not.toHaveBeenCalled();
            });
        });
    });

    describe('polygon created event handler', () => {
        let createdHandler;
        let newLayer;

        beforeEach(() => {
            createdHandler = map.on.calls.argsFor(3)[1];
            newLayer = {
                on: angular.noop
            };
            spyOn(newLayer, 'on');
        });

        it('will be bound to the map', () => {
            expect(map.on).toHaveBeenCalledWith(L.Draw.Event.CREATED, jasmine.any(Function));
        });

        it('will add a polygon layer', () => {
            createdHandler({
                layerType: 'polygon',
                layer: newLayer
            });

            expect(drawnItems.addLayer).toHaveBeenCalledTimes(1);
            expect(drawnItems.addLayer).toHaveBeenCalledWith(newLayer);
        });

        it('will do nothing with layer types other than polygon', () => {
            createdHandler({
                layerType: 'polyline',
                layer: newLayer
            });

            expect(drawnItems.addLayer).not.toHaveBeenCalled();

            createdHandler({
                layerType: null,
                layer: newLayer
            });

            expect(drawnItems.addLayer).not.toHaveBeenCalled();

            createdHandler({
                layer: newLayer
            });

            expect(drawnItems.addLayer).not.toHaveBeenCalled();
        });

        describe('polygon clicked event handler', () => {
            let clickHandler;

            beforeEach(() => {
                createdHandler({
                    layerType: 'polygon',
                    layer: newLayer
                });

                clickHandler = newLayer.on.calls.first().args[1];
            });

            it('it will be bound to the new layer', () => {
                expect(newLayer.on).toHaveBeenCalledTimes(1);
                expect(newLayer.on).toHaveBeenCalledWith('click', jasmine.any(Function));
            });

            it('will stop propagation of the click event', () => {
                clickHandler('clickEvent');

                expect(L.DomEvent.stop).toHaveBeenCalledTimes(1);
                expect(L.DomEvent.stop).toHaveBeenCalledWith('clickEvent');
            });

            it('toggles edit mode', () => {
                // Turn on
                drawShapeHandler.enabled.and.returnValue(false);
                editShapeHandler.enabled.and.returnValue(false);
                editShapeHandler.enable.and.callFake(() => {
                    editShapeHandler.enabled.and.returnValue(true);
                });

                clickHandler();

                expect(editShapeHandler.enable).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.MAP_SET_DRAWING_MODE,
                    payload: 'EDIT'
                });

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.disable).not.toHaveBeenCalled();

                // Turn off
                drawShapeHandler.enable.calls.reset();
                drawShapeHandler.disable.calls.reset();
                editShapeHandler.enable.calls.reset();
                editShapeHandler.disable.calls.reset();
                store.dispatch.calls.reset();

                editShapeHandler.enabled.and.returnValue(true);
                editShapeHandler.disable.and.callFake(() => {
                    editShapeHandler.enabled.and.returnValue(false);
                });

                clickHandler();

                expect(editShapeHandler.disable).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.MAP_SET_DRAWING_MODE,
                    payload: null
                });

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.enable).not.toHaveBeenCalled();

                // Turn on again
                drawShapeHandler.enable.calls.reset();
                drawShapeHandler.disable.calls.reset();
                editShapeHandler.enable.calls.reset();
                editShapeHandler.disable.calls.reset();
                store.dispatch.calls.reset();

                editShapeHandler.enabled.and.returnValue(false);
                editShapeHandler.enable.and.callFake(() => {
                    editShapeHandler.enabled.and.returnValue(true);
                });

                clickHandler();

                expect(editShapeHandler.enable).toHaveBeenCalledTimes(1);
                expect(store.dispatch).toHaveBeenCalledWith({
                    type: ACTIONS.MAP_SET_DRAWING_MODE,
                    payload: 'EDIT'
                });

                expect(drawShapeHandler.enable).not.toHaveBeenCalled();
                expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                expect(editShapeHandler.disable).not.toHaveBeenCalled();
            });
        });
    });

    describe('vertex created event handler', () => {
        let createdHandler,
            clickHandlers = [],
            vertices = [{
                on: angular.noop,
                off: angular.noop
            }, {
                on: angular.noop,
                off: angular.noop
            }, {
                on: angular.noop,
                off: angular.noop
            }];

        beforeEach(() => {
            createdHandler = map.on.calls.argsFor(2)[1];

            vertices.forEach(vertex => {
                spyOn(vertex, 'on');
                spyOn(vertex, 'off');
            });
        });

        it('will be bound to the map', () => {
            expect(map.on).toHaveBeenCalledWith(L.Draw.Event.DRAWVERTEX, jasmine.any(Function));
        });

        describe('delete vertex event handler', () => {
            it('will be bound to the last vertex', () => {
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();

                // will also be called to bind to complete shape
                expect(vertices[0].on).toHaveBeenCalledTimes(2);
                expect(vertices[0].on.calls.argsFor(0)).toEqual(['click', jasmine.any(Function)]);
                expect(vertices[0].on.calls.argsFor(1)).toEqual(['click', jasmine.any(Function)]);

                // Second vertex
                drawShapeHandler._markers[1] = vertices[1];
                createdHandler();

                expect(vertices[1].on).toHaveBeenCalledTimes(1);
                expect(vertices[1].on).toHaveBeenCalledWith('click', jasmine.any(Function));

                // Third vertex
                drawShapeHandler._markers[2] = vertices[2];
                createdHandler();

                expect(vertices[2].on).toHaveBeenCalledTimes(1);
                expect(vertices[2].on).toHaveBeenCalledWith('click', jasmine.any(Function));
            });

            it('will be unbound from the previous vertices', () => {
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();

                // Second vertex (unbind from first)
                drawShapeHandler._markers[1] = vertices[1];
                createdHandler();

                expect(vertices[0].off).toHaveBeenCalledTimes(1);
                expect(vertices[0].off).toHaveBeenCalledWith('click', jasmine.any(Function));

                // Third vertex (unbind from second)
                drawShapeHandler._markers[2] = vertices[2];
                createdHandler();

                expect(vertices[1].off).toHaveBeenCalledTimes(1);
                expect(vertices[1].off).toHaveBeenCalledWith('click', jasmine.any(Function));
            });

            it('will not be bound in the corner case of the draw handler not being enabled', () => {
                // Disable draw tool
                drawShapeHandler.enabled.and.returnValue(false);

                drawShapeHandler._markers = [vertices[0]];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();
            });

            it('will not be bound in the corner case of the draw handler having no vertices', () => {
                // Disable draw tool
                drawShapeHandler.enabled.and.returnValue(false);

                // Empty array
                drawShapeHandler._markers = [];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // null
                drawShapeHandler._markers = null;
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // undefined
                delete drawShapeHandler._markers;
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();
            });

            it('will not be bound in the corner case of the last vertex being falsy', () => {
                drawShapeHandler.enabled.and.returnValue(true);

                // false
                drawShapeHandler._markers = [false];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // 0
                drawShapeHandler._markers = [0];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // ''
                drawShapeHandler._markers = [''];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // null
                drawShapeHandler._markers = [null];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();
            });

            it('will delete the last vertex, unbind itself and rebind the previous vertex', () => {
                drawShapeHandler.deleteLastVertex.and.callFake(() => {
                    drawShapeHandler._markers.length--;
                });
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();

                // Second vertex
                drawShapeHandler._markers[1] = vertices[1];
                createdHandler();
                clickHandlers[1] = vertices[1].on.calls.first().args[1];

                // Third vertex
                drawShapeHandler._markers[2] = vertices[2];
                createdHandler();
                clickHandlers[2] = vertices[2].on.calls.first().args[1];

                // Delete third vertex
                vertices[1].on.calls.reset();
                clickHandlers[2]();
                expect(drawShapeHandler.deleteLastVertex).toHaveBeenCalledTimes(1);
                expect(vertices[2].off).toHaveBeenCalledTimes(1);
                expect(vertices[2].off).toHaveBeenCalledWith('click', jasmine.any(Function));
                expect(vertices[1].on).toHaveBeenCalledTimes(1);
                expect(vertices[1].on).toHaveBeenCalledWith('click', jasmine.any(Function));

                // Delete second vertex
                vertices[0].on.calls.reset();
                clickHandlers[1]();

                expect(drawShapeHandler.deleteLastVertex).toHaveBeenCalledTimes(2);
                expect(vertices[1].off).toHaveBeenCalledWith('click', jasmine.any(Function));
                expect(vertices[0].on).toHaveBeenCalledTimes(1);
                expect(vertices[0].on).toHaveBeenCalledWith('click', jasmine.any(Function));
            });

            it('will delete the first (and last) and only vertex by disabling and enabling the draw tool', () => {
                drawShapeHandler.disable.and.callFake(() => {
                    drawShapeHandler._markers.length--;
                    drawShapeHandler.enabled.and.returnValue(false);
                });
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();
                clickHandlers[0] = vertices[0].on.calls.first().args[1];

                drawShapeHandler.enable.calls.reset();
                drawShapeHandler.disable.calls.reset();
                clickHandlers[0]();

                expect(drawShapeHandler.enable).toHaveBeenCalledTimes(1);
                expect(drawShapeHandler.disable).toHaveBeenCalledTimes(1);
            });

            it('will not delete the last vertex in the corner case of the draw handler not being enabled', () => {
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();

                // Second vertex
                drawShapeHandler._markers[1] = vertices[1];
                createdHandler();
                clickHandlers[1] = vertices[1].on.calls.first().args[1];

                // Disable draw tool
                drawShapeHandler.enabled.and.returnValue(false);

                // Delete second vertex
                vertices[0].on.calls.reset();
                clickHandlers[1]();

                expect(drawShapeHandler.deleteLastVertex).not.toHaveBeenCalled();
                expect(vertices[1].off).not.toHaveBeenCalled();
                expect(vertices[0].on).not.toHaveBeenCalled();
            });

            it('will not delete the last vertex in the corner case of there being no vertices', () => {
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();

                // Second vertex
                drawShapeHandler._markers[1] = vertices[1];
                createdHandler();
                clickHandlers[1] = vertices[1].on.calls.first().args[1];

                // Empty array
                drawShapeHandler._markers = [];

                // Delete second vertex
                vertices[0].on.calls.reset();
                clickHandlers[1]();

                expect(drawShapeHandler.deleteLastVertex).not.toHaveBeenCalled();
                expect(vertices[1].off).not.toHaveBeenCalled();
                expect(vertices[0].on).not.toHaveBeenCalled();
            });

            it('will not be bound in the corner case of the draw handler having no vertices', () => {
                // Empty array
                drawShapeHandler.enabled.and.returnValue(false);
                drawShapeHandler._markers = [];
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // null
                drawShapeHandler._markers = null;
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();

                // undefined
                delete drawShapeHandler._markers;
                createdHandler();

                expect(vertices[0].on).not.toHaveBeenCalled();
            });
        });

        describe('complete shape by clicking on the first vertex event handler', () => {
            [() => {
                // Create the first vertex
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();
                clickHandlers[0] = vertices[0].on.calls.argsFor(1)[1];
            }, () => {
                // Create two vertices and then remove the second
                drawShapeHandler.enabled.and.returnValue(true);
                drawShapeHandler._markers = [vertices[0]];
                createdHandler();
                clickHandlers[0] = vertices[0].on.calls.argsFor(1)[1];

                // Second vertex
                drawShapeHandler._markers[1] = vertices[1];
                createdHandler();
                clickHandlers[1] = vertices[1].on.calls.first().args[1];

                // Remove second vertex
                clickHandlers[1]();
                drawShapeHandler._markers.length--;
                clickHandlers.length--;
            }].forEach(beforeEachFn => {
                beforeEach(beforeEachFn);

                it('will do nothing when it is the only vertex', () => {
                    // Completing the shape will be handled by Leaflet draw

                    // Click on first vertex
                    drawShapeHandler.completeShape.calls.reset();
                    drawShapeHandler.disable.calls.reset();
                    clickHandlers[0]();

                    expect(drawShapeHandler.completeShape).not.toHaveBeenCalled();
                    expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                });

                it('will complete the polygon by disabling the draw tool with exactly two vertices', () => {
                    // When there are more than two vertices Leaflet draw will
                    // complete the shape.
                    // In case there are exactly two vertices Leaflet draw will not
                    // allow you to complete the shape because the lines are not
                    // allowed to cross.
                    // To prevent this last error, we will call completeShape on
                    // the drawHandler manually which will automatically complete
                    // the shape for us. And in this case without an error.

                    // Second vertex
                    drawShapeHandler._markers[1] = vertices[1];
                    createdHandler();

                    // Click on first vertex
                    drawShapeHandler.completeShape.calls.reset();
                    drawShapeHandler.disable.calls.reset();
                    clickHandlers[0]();

                    expect(drawShapeHandler.completeShape).toHaveBeenCalledTimes(1);
                    expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                });

                it('will do nothing when there are more than two vertices', () => {
                    // Completing the shape will be handled by Leaflet draw

                    // Second vertex
                    drawShapeHandler._markers[1] = vertices[1];
                    createdHandler();

                    // Third vertex
                    drawShapeHandler._markers[2] = vertices[2];
                    createdHandler();

                    // Click on first vertex
                    drawShapeHandler.completeShape.calls.reset();
                    drawShapeHandler.disable.calls.reset();
                    clickHandlers[0]();

                    expect(drawShapeHandler.completeShape).not.toHaveBeenCalled();
                    expect(drawShapeHandler.disable).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('draw stop event handler', () => {
        let stopHandler;

        beforeEach(() => {
            stopHandler = map.on.calls.argsFor(1)[1];
        });

        it('will be bound to the map', () => {
            expect(map.on).toHaveBeenCalledWith(L.Draw.Event.DRAWSTOP, jasmine.any(Function));
        });

        it('will dispatch an action with payload null to reset the drawing mode', () => {
            stopHandler();
            expect(store.dispatch).toHaveBeenCalledTimes(1);
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_DRAWING_MODE,
                payload: null
            });
        });
    });

    describe('click on map', () => {
        let clickHandler,
            createdHandler,
            layerClickHandler,
            newLayer;

        beforeEach(() => {
            clickHandler = map.on.calls.argsFor(0)[1];
            createdHandler = map.on.calls.argsFor(3)[1];
            newLayer = {
                on: angular.noop,
                off: angular.noop
            };
            spyOn(newLayer, 'on');
            spyOn(newLayer, 'off');
        });

        it('will be bound to the map', () => {
            expect(map.on).toHaveBeenCalledWith('click', jasmine.any(Function));
        });

        it('deletes the polygon layer', () => {
            createdHandler({
                layerType: 'polygon',
                layer: newLayer
            });
            layerClickHandler = newLayer.on.calls.first().args[1];

            // Click on map
            clickHandler();

            expect(L.LayerGroup).toHaveBeenCalledTimes(1);
            expect(newLayer.off).toHaveBeenCalledTimes(1);
            expect(newLayer.off).toHaveBeenCalledWith('click', layerClickHandler);
            expect(drawnItems.removeLayer).toHaveBeenCalledTimes(1);
            expect(drawnItems.removeLayer).toHaveBeenCalledWith(newLayer);
            expect(layerGroup.addLayer).toHaveBeenCalledTimes(1);
            expect(layerGroup.addLayer).toHaveBeenCalledWith(newLayer);
            expect(map.fire).toHaveBeenCalledTimes(1);
            expect(map.fire).toHaveBeenCalledWith(L.Draw.Event.DELETED, {
                layers: layerGroup
            });
        });

        it('deletes the polygon layer while in edit mode', () => {
            editShapeHandler.enabled.and.returnValue(true);
            createdHandler({
                layerType: 'polygon',
                layer: newLayer
            });
            layerClickHandler = newLayer.on.calls.first().args[1];

            // Click on map
            clickHandler();

            expect(L.LayerGroup).toHaveBeenCalledTimes(1);
            expect(newLayer.off).toHaveBeenCalledTimes(1);
            expect(newLayer.off).toHaveBeenCalledWith('click', layerClickHandler);
            expect(drawnItems.removeLayer).toHaveBeenCalledTimes(1);
            expect(drawnItems.removeLayer).toHaveBeenCalledWith(newLayer);
            expect(layerGroup.addLayer).toHaveBeenCalledTimes(1);
            expect(layerGroup.addLayer).toHaveBeenCalledWith(newLayer);
            expect(map.fire).toHaveBeenCalledTimes(1);
            expect(map.fire).toHaveBeenCalledWith(L.Draw.Event.DELETED, {
                layers: layerGroup
            });
        });

        it('does nothing when in draw mode', () => {
            drawShapeHandler.enabled.and.returnValue(true);

            // Click on map
            clickHandler();

            expect(L.LayerGroup).not.toHaveBeenCalled();
            expect(newLayer.off).not.toHaveBeenCalled();
            expect(drawnItems.removeLayer).not.toHaveBeenCalled();
            expect(layerGroup.addLayer).not.toHaveBeenCalled();
            expect(map.fire).not.toHaveBeenCalled();
        });

        it('does nothing when there is no polygon', () => {
            // Click on map
            clickHandler();

            expect(L.LayerGroup).not.toHaveBeenCalled();
            expect(newLayer.off).not.toHaveBeenCalled();
            expect(drawnItems.removeLayer).not.toHaveBeenCalled();
            expect(layerGroup.addLayer).not.toHaveBeenCalled();
            expect(map.fire).not.toHaveBeenCalled();
        });
    });
});
