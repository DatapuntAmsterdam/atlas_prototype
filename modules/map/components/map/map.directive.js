(() => {
    angular
        .module('dpMap')
        .directive('dpMap', dpMapDirective);

    dpMapDirective.$inject = [
        'L',
        'mapConfig',
        'layers',
        'highlight',
        'panning',
        'zoom',
        'onMapClick',
        'user',
        'overlays'
    ];

    function dpMapDirective (L, mapConfig, layers, highlight, panning, zoom, onMapClick, user, overlays) {
        return {
            restrict: 'E',
            scope: {
                mapState: '=',
                markers: '=',
                drawGeometry: '=',
                showLayerSelection: '=',
                resize: '<'
            },
            templateUrl: 'modules/map/components/map/map.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            let leafletMap,
                oldOverlays = null;

            const container = element[0].querySelector('.js-leaflet-map');
            const options = angular.merge(mapConfig.MAP_OPTIONS, {
                center: scope.mapState.viewCenter,
                zoom: scope.mapState.zoom,
                preferCanvas: true
            });

            /**
             * [tg-937] Wait for the next digest cycle to ensure this directive is appended to the DOM. Without being
             * added to the DOM it will have a width of 0 (zero) and that causes issues with centering the map.
             */
            scope.$applyAsync(() => {
                leafletMap = L.map(container, options);

                panning.initialize(leafletMap);
                highlight.initialize();
                zoom.initialize(leafletMap);
                onMapClick.initialize(leafletMap);

                scope.leafletMap = leafletMap;

                scope.$watch('mapState.viewCenter', function (viewCenter) {
                    panning.panTo(leafletMap, viewCenter);
                });

                scope.$watch('mapState.zoom', function (zoomLevel) {
                    zoom.setZoom(leafletMap, zoomLevel);
                });

                scope.$watch('mapState.baseLayer', function (baseLayer) {
                    layers.setBaseLayer(leafletMap, baseLayer);
                });

                scope.$watch(user.getAuthorizationLevel, setOverlays);

                scope.$watch('mapState.overlays', setOverlays, true);

                scope.$watch('markers.regular', function (newCollection, oldCollection) {
                    if (angular.equals(newCollection, oldCollection)) {
                        // Initialisation
                        newCollection.forEach(function (item) {
                            highlight.addMarker(leafletMap, item);
                        });
                    } else {
                        // Change detected
                        getRemovedGeojson(newCollection, oldCollection).forEach(function (item) {
                            highlight.removeMarker(leafletMap, item);
                        });

                        getAddedGeojson(newCollection, oldCollection).forEach(function (item) {
                            highlight.addMarker(leafletMap, item);
                        });
                    }
                }, true);

                scope.$watch('markers.clustered', function (newCollection, oldCollection) {
                    highlight.clearCluster(leafletMap);

                    if (newCollection.length) {
                        highlight.setCluster(leafletMap, newCollection);
                    }
                }, true);

                scope.$watchCollection('resize', () => {
                    // Waiting for next digest cycle.
                    scope.$applyAsync(() => {
                        leafletMap.invalidateSize();
                    });
                });

                scope.$watch('mapState.drawingMode', (drawingMode) => {
                    scope.drawingMode = drawingMode;
                });
            });

            function setOverlays () {
                const newOverlays = scope.mapState.overlays.filter(overlay => overlays.SOURCES[overlay.id]),
                    isInit = oldOverlays === null;

                oldOverlays = oldOverlays || [];
                scope.hasActiveOverlays = newOverlays.length > 0;

                if (angular.equals(newOverlays, oldOverlays)) {
                    return;
                }

                getRemovedOverlays(newOverlays, oldOverlays).forEach(function (overlay) {
                    layers.removeOverlay(leafletMap, overlay);
                });

                getAddedOverlays(newOverlays, oldOverlays).forEach(function (overlay) {
                    layers.addOverlay(leafletMap, overlay);
                });

                getLayersToHide(newOverlays, oldOverlays, isInit).forEach(overlay => {
                    layers.hideOverlay(leafletMap, overlay);
                });

                getLayersToShow(newOverlays, oldOverlays).forEach(overlay => {
                    layers.showOverlay(leafletMap, overlay);
                });

                oldOverlays = newOverlays;
            }
        }

        function getAddedOverlays (newOverlays, oldOverlays) {
            return diffOverlays(newOverlays, oldOverlays);
        }

        function getRemovedOverlays (newOverlays, oldOverlays) {
            return diffOverlays(oldOverlays, newOverlays);
        }

        function diffOverlays (over1, over2) {
            return over1.filter(el => {
                return !over2.some(item => item.id === el.id);
            }).map(layer => layer.id);
        }

        function getLayersToHide (newOverlays, oldOverlays, isInit) {
            return diffOverlayVisibility(newOverlays, oldOverlays, false, isInit);
        }

        function getLayersToShow (newOverlays, oldOverlays) {
            return diffOverlayVisibility(newOverlays, oldOverlays, true);
        }

        function diffOverlayVisibility (over1, over2, visibilityState, isInit) {
            return over1.filter((layer, index) => {
                const old = over2[index];

                if (isInit) {
                    return layer.isVisible === visibilityState;
                }

                if (old && old.id === layer.id) {
                    return old.isVisible !== layer.isVisible && layer.isVisible === visibilityState;
                }
            }).map(layer => layer.id);
        }

        function getAddedGeojson (newCollection, oldCollection) {
            return newCollection.filter(function (newItem) {
                var hasBeenAdded,
                    hasChanged,
                    linkedOldItems;

                linkedOldItems = oldCollection.filter(function (oldItem) {
                    return oldItem.id === newItem.id;
                });

                hasBeenAdded = linkedOldItems.length === 0;
                hasChanged = !angular.equals(linkedOldItems[0], newItem);

                return hasBeenAdded || hasChanged;
            });
        }

        function getRemovedGeojson (newCollection, oldCollection) {
            return oldCollection.filter(function (oldItem) {
                var hasBeenRemoved,
                    hasChanged,
                    linkedNewItems;

                linkedNewItems = newCollection.filter(function (newItem) {
                    return newItem.id === oldItem.id;
                });

                hasBeenRemoved = linkedNewItems.length === 0;
                hasChanged = !angular.equals(linkedNewItems[0], oldItem);

                return hasBeenRemoved || hasChanged;
            });
        }
    }
})();
