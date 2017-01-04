(function () {
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
        'measure',
        'variableWidth',
        'onMapClick'
    ];

    function dpMapDirective (L, mapConfig, layers, highlight, panning, zoom, measure, variableWidth, onMapClick) {
        return {
            restrict: 'E',
            scope: {
                mapState: '=',
                markers: '=',
                showLayerSelection: '='
            },
            templateUrl: 'modules/map/components/map/map.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            var leafletMap,
                container,
                options;

            scope.$watchGroup(['mapState.isFullscreen', 'showLayerSelection'], function () {
                scope.isFullscreen = scope.mapState.isFullscreen && !scope.showLayerSelection;
            });

            container = element[0].querySelector('.js-leaflet-map');
            options = angular.merge(mapConfig.MAP_OPTIONS, {
                center: scope.mapState.viewCenter,
                zoom: scope.mapState.zoom
            });

            /**
             * [tg-937] Wait for the next digest cycle to ensure this directive is appended to the DOM. Without being
             * added to the DOM it will have a width of 0 (zero) and that causes issues with centering the map.
             */
            scope.$applyAsync(function () {
                leafletMap = L.map(container, options);

                panning.initialize(leafletMap);
                highlight.initialize();
                zoom.initialize(leafletMap);
                measure.initialize(leafletMap);
                variableWidth.initialize(container, leafletMap);
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

                scope.$watch('mapState.overlays', function (newOverlays, oldOverlays) {
                    scope.hasActiveOverlays = scope.mapState.overlays.length > 0;

                    getRemovedOverlays(newOverlays, oldOverlays).forEach(function (overlay) {
                        layers.removeOverlay(leafletMap, overlay);
                    });

                    getAddedOverlays(newOverlays, oldOverlays).forEach(function (overlay) {
                        layers.addOverlay(leafletMap, overlay);
                    });
                }, true);

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
                    if (newCollection.length) {
                        highlight.setCluster(leafletMap, newCollection);
                    } else {
                        highlight.clearCluster(leafletMap);
                    }
                }, true);
            });
        }

        function getDiffFromOverlays (over1, over2) {
            // Finds all the keys for items in over1 that
            // are not in over2
            // Or if visibility was changed.
            var keys = [],
                add;

            for (var i = 0; i < over1.length; i++) {
                add = true;
                for (var j = 0; j < over2.length; j++) {
                    if (over2[j].id === over1[i].id) {
                        // Checking visibility change
                        if (over2[j].isVisible !== over1[i].isVisible) {
                            // Making sure visibility was changed to what we expect
                            if (over2[j].isVisible) {
                                add = false;
                            }
                        } else {
                            // No change was made
                            add = false; // Exists in both overlays
                        }
                        break;
                    }
                }
                if (add) {
                    keys.push(over1[i].id);
                }
            }
            return keys;
        }

        function getAddedOverlays (newOverlays, oldOverlays) {
            // checking for init state when both are the same
            if (angular.equals(newOverlays, oldOverlays)) {
                oldOverlays = [];
            }

            return getDiffFromOverlays(newOverlays, oldOverlays);
        }

        function getRemovedOverlays (newOverlays, oldOverlays) {
            return getDiffFromOverlays(oldOverlays, newOverlays);
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
