((() => {
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
                oldOverlays = [];

            const container = element[0].querySelector('.js-leaflet-map');
            const options = angular.merge(mapConfig.MAP_OPTIONS, {
                center: scope.mapState.viewCenter,
                zoom: scope.mapState.zoom
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

                scope.$watch('mapState.viewCenter', viewCenter => {
                    panning.panTo(leafletMap, viewCenter);
                });

                scope.$watch('mapState.zoom', zoomLevel => {
                    zoom.setZoom(leafletMap, zoomLevel);
                });

                scope.$watch('mapState.baseLayer', baseLayer => {
                    layers.setBaseLayer(leafletMap, baseLayer);
                });

                scope.$watch(user.getAuthorizationLevel, setOverlays);

                scope.$watch('mapState.overlays', setOverlays, true);

                scope.$watch('markers.regular', (newCollection, oldCollection) => {
                    if (angular.equals(newCollection, oldCollection)) {
                        // Initialisation
                        newCollection.forEach(item => {
                            highlight.addMarker(leafletMap, item);
                        });
                    } else {
                        // Change detected
                        getRemovedGeojson(newCollection, oldCollection).forEach(item => {
                            highlight.removeMarker(leafletMap, item);
                        });

                        getAddedGeojson(newCollection, oldCollection).forEach(item => {
                            highlight.addMarker(leafletMap, item);
                        });
                    }
                }, true);

                scope.$watch('markers.clustered', (newCollection, oldCollection) => {
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
                    // checking for init state when both are the same
                    isInit = angular.equals(newOverlays, oldOverlays);

                scope.hasActiveOverlays = newOverlays.length > 0;

                getRemovedOverlays(newOverlays, oldOverlays, isInit).forEach(overlay => {
                    layers.removeOverlay(leafletMap, overlay);
                });

                getAddedOverlays(newOverlays, oldOverlays, isInit).forEach(overlay => {
                    layers.addOverlay(leafletMap, overlay);
                });

                oldOverlays = newOverlays;
            }
        }

        function getDiffFromOverlays (over1, over2, callback) {
            // Finds all the keys for items in over1 that
            // are not in over2
            // Or if visibility was changed.
            // or use callback to decide which to show and hide
            var keys = [],
                add;

            for (var i = 0; i < over1.length; i++) {
                add = true;
                for (var j = 0; j < over2.length; j++) {
                    if (over2[j].id === over1[i].id) {
                        // Checking visibility change
                        if (angular.isFunction(callback)) {
                            add = callback.call(this, over1[i]);
                        } else if (over2[j].isVisible !== over1[i].isVisible) {
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

        function getAddedOverlays (newOverlays, oldOverlays, isInit) {
            return getDiffFromOverlays(newOverlays, oldOverlays, isInit ? (item) => item.isVisible : '');
        }

        function getRemovedOverlays (newOverlays, oldOverlays, isInit) {
            return getDiffFromOverlays(oldOverlays, newOverlays, isInit ? (item) => !item.isVisible : '');
        }

        function getAddedGeojson (newCollection, oldCollection) {
            return newCollection.filter(newItem => {
                var hasBeenAdded,
                    hasChanged,
                    linkedOldItems;

                linkedOldItems = oldCollection.filter(oldItem => oldItem.id === newItem.id);

                hasBeenAdded = linkedOldItems.length === 0;
                hasChanged = !angular.equals(linkedOldItems[0], newItem);

                return hasBeenAdded || hasChanged;
            });
        }

        function getRemovedGeojson (newCollection, oldCollection) {
            return oldCollection.filter(oldItem => {
                var hasBeenRemoved,
                    hasChanged,
                    linkedNewItems;

                linkedNewItems = newCollection.filter(newItem => newItem.id === oldItem.id);

                hasBeenRemoved = linkedNewItems.length === 0;
                hasChanged = !angular.equals(linkedNewItems[0], oldItem);

                return hasBeenRemoved || hasChanged;
            });
        }
    }
}))();
