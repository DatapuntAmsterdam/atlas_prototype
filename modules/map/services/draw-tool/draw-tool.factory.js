(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('drawTool', drawToolFactory);

    drawToolFactory.$inject = ['store', 'ACTIONS', 'L', 'DRAW_TOOL_CONFIG',
        'onMapClick'
    ];

    function drawToolFactory (store, ACTIONS, L, DRAW_TOOL_CONFIG, onMapClick) {
        let leafletMap,
            drawnItems,
            drawShapeHandler,
            editShapeHandler,
            firstMarker,
            lastMarker,
            currentLayer;

        return {
            initialize
        };

        function initialize (map) {
            let editConfig = angular.copy(DRAW_TOOL_CONFIG.edit),
                editToolbar;

            store.subscribe(() => {
                if (store.getState().map.drawingMode) {
                    enable();
                } else {
                    disable();
                }
            });

            leafletMap = map;
            drawnItems = new L.FeatureGroup();
            drawShapeHandler = new L.Draw.Polygon(leafletMap,
                DRAW_TOOL_CONFIG.draw.polygon);

            editConfig.featureGroup = drawnItems;
            editToolbar = new L.EditToolbar(editConfig);
            editShapeHandler = editToolbar.getModeHandlers(leafletMap)[0].handler;

            leafletMap.addLayer(drawnItems);
            leafletMap.on('click', function () {
                if (!drawShapeHandler.enabled()) {
                    deleteShape();
                }
            });
            leafletMap.on(L.Draw.Event.DRAWSTOP, function () {
                updateState();
            });
            leafletMap.on(L.Draw.Event.DRAWVERTEX, function (e) {
                checkNumberOfPoints(e);
                bindLastMarker();
            });
            leafletMap.on(L.Draw.Event.CREATED, function (e) {
                var type = e.layerType,
                    layer = e.layer;

                if (type === 'polygon') {
                    let flatCoordinates = layer.getLatLngs ()[0]
                        .map(({
                            lat, lng
                        }) => [lat, lng]);

                    store.dispatch({
                        type: ACTIONS.FETCH_DATA_SELECTION,
                        payload: {
                            dataset: 'bag',
                            filters: 'shape',
                            shape: flatCoordinates,
                            page: 1
                        }
                    });

                    currentLayer = layer;
                    drawnItems.addLayer(layer);
                    layer.on('click', shapeClickHandler);
                }
            });
        }

        function checkNumberOfPoints (target) {
            let vertexCount = Object.keys(target.layers._layers).length;

            if (vertexCount >= DRAW_TOOL_CONFIG.MAX_POINTS) {
                completeShape();
                disable();
            } else {
                store.dispatch({
                    type: ACTIONS.MAP_SET_POINTS,
                    payload: vertexCount
                });
            }
        }

        function toggle () {
            if (isEnabled()) {
                disable();
            } else {
                enable();
            }
        }

        function isEnabled () {
            return drawShapeHandler.enabled() || editShapeHandler.enabled();
        }

        function enable () {
            if (!isEnabled()) {
                if (currentLayer) {
                    editShapeHandler.enable();
                } else {
                    drawShapeHandler.enable();
                }
                updateState();
            }
        }

        function disable () {
            if (isEnabled()) {
                if (drawShapeHandler.enabled()) {
                    if (drawShapeHandler._markers && drawShapeHandler._markers.length > 1) {
                        drawShapeHandler.completeShape();
                    } else {
                        drawShapeHandler.disable();
                    }
                    updateState();
                } else {
                    editShapeHandler.save();
                    editShapeHandler.disable();
                    updateState();
                }
            }
        }

        function updateState () {
            let currentMode = null;

            if (isEnabled()) {
                currentMode = drawShapeHandler.enabled() ? 'DRAW' : 'EDIT';
            }

            store.dispatch({
                type: ACTIONS.MAP_SET_DRAWING_MODE,
                payload: currentMode
            });
        }

        function bindLastMarker () {
            if (lastMarker) {
                lastMarker.off('click', deleteLastMarker);
                lastMarker = null;
            }
            if (drawShapeHandler.enabled() && drawShapeHandler._markers.length) {
                lastMarker = drawShapeHandler._markers[drawShapeHandler._markers.length - 1];
                if (lastMarker) {
                    lastMarker.on('click', deleteLastMarker);
                }
            }
            if (!firstMarker && lastMarker) {
                firstMarker = lastMarker;
                firstMarker.on('click', completeShape);
            }
        }

        // When trying to complete a shape of only two points (a line) by
        // clicking on the first vertex again results in Leaflet draw giving an
        // error that the lines should not cross.
        //
        // When there is only one vertex, it will be deleted (see
        // previous test).
        // When there are more than two vertices Leaflet draw will
        // complete the shape.
        // In case there are exactly two vertices Leaflet draw will not
        // allow you to complete the shape because the lines are not
        // allowed to cross.
        // To prevent this last error, we will call disable which in turn will
        // call drawShapeHandler.completeShape manually which will
        // automatically complete the shape for us. And in this case without
        // an error.
        function completeShape () {
            if (drawShapeHandler.enabled() && drawShapeHandler._markers.length === 2) {
                disable();
            }
        }

        function deleteLastMarker () {
            if (drawShapeHandler.enabled()) {
                if (drawShapeHandler._markers.length === 1) {
                    // Leaflet draw does not allow deleting the very first
                    // marker; work around by disabling and enabling the draw
                    // tool.
                    disable();
                    enable();
                } else if (drawShapeHandler._markers.length > 1) {
                    drawShapeHandler.deleteLastVertex();
                    bindLastMarker();
                }
            }
        }

        function shapeClickHandler (e) {
            L.DomEvent.stop(e);
            toggle();
        }

        function deleteShape () {
            if (currentLayer) {
                let deletedLayers = new L.LayerGroup();
                currentLayer.off('click', shapeClickHandler);
                drawnItems.removeLayer(currentLayer);
                deletedLayers.addLayer(currentLayer);
                leafletMap.fire(L.Draw.Event.DELETED, {
                    layers: deletedLayers
                });
                currentLayer = null;
                disable();
            }
        }
    }
})();
