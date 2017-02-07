describe('The dp-map directive', function () {
    let $compile,
        $rootScope,
        L,
        layers,
        highlight,
        panning,
        zoom,
        drawTool,
        onMapClick,
        mockedMapState,
        mockedLeafletMap,
        mockedMarkers;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop,
                    subscribe: angular.noop
                },
                leafletMap: {
                    invalidateSize: angular.noop
                },
                mapConfig: {
                    MAP_OPTIONS: {
                        doThisThing: false,
                        someVariable: 4
                    }
                },
                highlight: {
                    initialize: angular.noop,
                    addMarker: angular.noop,
                    removeMarker: angular.noop,
                    setCluster: angular.noop,
                    clearCluster: angular.noop
                },
                panning: {
                    initialize: angular.noop,
                    panTo: angular.noop,
                    setOption: angular.noop
                },
                zoom: {
                    initialize: angular.noop,
                    setZoom: angular.noop
                },
                onMapClick: {
                    initialize: angular.noop
                }
            },

            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });

                $provide.factory('dpToggleLayerSelectionDirective', function () {
                    return {};
                });

                $provide.factory('dpDrawToolDirective' +
                    '', function () {
                    return {};
                });

                $provide.factory('dpActiveOverlaysDirective', function () {
                    return {};
                });

                $provide.factory('dpToggleFullscreenDirective', function () {
                    return {};
                });
            }
        );
        mockedLeafletMap = {
            invalidateSize: angular.noop
        };

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _L_,
            _layers_,
            _highlight_,
            _panning_,
            _zoom_,
            _drawTool_,
            _onMapClick_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            L = _L_;
            layers = _layers_;
            highlight = _highlight_;
            panning = _panning_;
            zoom = _zoom_;
            drawTool = _drawTool_;
            onMapClick = _onMapClick_;
        });
        spyOn(L, 'map').and.returnValue(mockedLeafletMap);

        spyOn(mockedLeafletMap, 'invalidateSize');
        spyOn(layers, 'setBaseLayer');
        spyOn(layers, 'addOverlay');
        spyOn(layers, 'removeOverlay');
        spyOn(highlight, 'initialize');
        spyOn(highlight, 'addMarker');
        spyOn(highlight, 'removeMarker');
        spyOn(highlight, 'setCluster').and.callThrough();
        spyOn(highlight, 'clearCluster');

        spyOn(panning, 'initialize');
        spyOn(panning, 'panTo');
        spyOn(panning, 'setOption');
        spyOn(zoom, 'initialize');
        spyOn(zoom, 'setZoom');
        spyOn(drawTool, 'initialize').and.callThrough();
        spyOn(drawTool, 'enable');
        spyOn(drawTool, 'disable');
        spyOn(onMapClick, 'initialize');

        mockedMapState = {
            baseLayer: 'topografie',
            overlays: [],
            viewCenter: [52.789, 4.123],
            isFullscreen: false,
            zoom: 12
        };

        mockedMarkers = {
            regular: [],
            clustered: []
        };
    });

    function getDirective (mapState, showLayerSelection, markers, useRootScopeApply, resize) {
        let directive,
            element,
            scope;

        element = document.createElement('dp-map');
        element.setAttribute('map-state', 'mapState');
        element.setAttribute('markers', 'markers');
        element.setAttribute('show-layer-selection', 'showLayerSelection');
        element.setAttribute('resize', 'resize');

        scope = $rootScope.$new();
        scope.mapState = mapState;
        scope.markers = markers;
        scope.resize = resize;
        scope.showLayerSelection = showLayerSelection;

        directive = $compile(element)(scope);

        scope.$apply();

        if (angular.isUndefined(useRootScopeApply) || useRootScopeApply) {
            $rootScope.$apply();
        }

        return directive;
    }

    it('doesn\'t initialize until the next digest cycle', function () {
        /**
         * This is needed to ensure that the map has a width. To have a width it needs to be appended to the DOM. And
         * adding to the DOM happens the next digest cycle.
         */
        getDirective(mockedMapState, false, mockedMarkers, false);
        expect(L.map).not.toHaveBeenCalled();

        $rootScope.$apply();
        expect(L.map).toHaveBeenCalled();
    });

    it('creates a Leaflet map with options based on both the map state and mapConfig', function () {
        let directive,
            element;

        directive = getDirective(mockedMapState, false, mockedMarkers);
        element = directive[0].querySelector('.js-leaflet-map');

        expect(L.map).toHaveBeenCalledWith(element, {
            center: [52.789, 4.123],
            zoom: 12,
            doThisThing: false,
            someVariable: 4
        });
    });

    describe('has a base layer which', function () {
        it('is set on initialization', function () {
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.setBaseLayer).toHaveBeenCalledWith(mockedLeafletMap, 'topografie');
        });

        it('changes when the mapState changes', function () {
            getDirective(mockedMapState, false, mockedMarkers);
            expect(layers.setBaseLayer).toHaveBeenCalledTimes(1);

            mockedMapState.baseLayer = 'luchtfoto_2015';
            $rootScope.$apply();

            expect(layers.setBaseLayer).toHaveBeenCalledTimes(2);
            expect(layers.setBaseLayer).toHaveBeenCalledWith(mockedLeafletMap, 'luchtfoto_2015');
        });
    });

    describe('has overlays which', function () {
        it('can be added on initialization', function () {
            mockedMapState.overlays = [{id: 'some_overlay', isVisible: true}];
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.addOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_overlay');
        });

        it('can be added when the mapState changes', function () {
            getDirective(mockedMapState, false, mockedMarkers);
            expect(layers.addOverlay).not.toHaveBeenCalled();

            mockedMapState.overlays = [
                {id: 'some_overlay', isVisible: true},
                {id: 'some_other_overlay', isVisible: true}
            ];
            $rootScope.$apply();

            expect(layers.addOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_overlay');
            expect(layers.addOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_other_overlay');
        });

        it('can be removed when the mapState changes', function () {
            mockedMapState.overlays = [
                {id: 'some_overlay', isVisible: true},
                {id: 'some_other_overlay', isVisible: true}
            ];
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.removeOverlay).not.toHaveBeenCalled();

            mockedMapState.overlays = [];
            $rootScope.$apply();

            expect(layers.removeOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_overlay');
            expect(layers.removeOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_other_overlay');
        });
        it('can be removed when isVisible changes', function () {
            mockedMapState.overlays = [
                {id: 'some_overlay', isVisible: true},
                {id: 'some_other_overlay', isVisible: true}
            ];
            getDirective(mockedMapState, false, mockedMarkers);

            mockedMapState.overlays = [
                {id: 'some_overlay', isVisible: false},
                {id: 'some_other_overlay', isVisible: true}
            ];
            $rootScope.$apply();

            expect(layers.removeOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_overlay');
            expect(layers.removeOverlay).not.toHaveBeenCalledWith(mockedLeafletMap, 'some_other_overlay');
        });
    });

    describe('has highlight options', function () {
        it('that gets a call to .initialize() so it can configure Leaflet variables', function () {
            expect(highlight.initialize).not.toHaveBeenCalled();

            getDirective(mockedMapState, false, mockedMarkers);
            expect(highlight.initialize).toHaveBeenCalled();
        });

        describe('that manage individual markers', function () {
            it('can be added on initialisation', function () {
                getDirective(mockedMapState, false, {
                    regular: [{id: 'FAKE_HIGHLIGHT_ITEM_A'}, {id: 'FAKE_HIGHLIGHT_ITEM_B'}],
                    clustered: []
                });

                expect(highlight.addMarker)
                    .toHaveBeenCalledWith(mockedLeafletMap, {id: 'FAKE_HIGHLIGHT_ITEM_A'});
                expect(highlight.addMarker)
                    .toHaveBeenCalledWith(mockedLeafletMap, {id: 'FAKE_HIGHLIGHT_ITEM_B'});
            });

            it('can be added by changing the input', function () {
                let highlightItems = {
                    regular: [
                        {id: 'FAKE_HIGHLIGHT_ITEM_A'},
                        {id: 'FAKE_HIGHLIGHT_ITEM_B'}
                    ],
                    clustered: []
                };

                getDirective(mockedMapState, false, highlightItems);

                highlightItems.regular.push({id: 'FAKE_HIGHLIGHT_ITEM_C'});
                $rootScope.$apply();

                expect(highlight.addMarker)
                    .toHaveBeenCalledWith(mockedLeafletMap, {id: 'FAKE_HIGHLIGHT_ITEM_C'});
            });

            it('can be removed from the map', function () {
                const highlightItems = {
                    regular: [
                        {id: 'FAKE_HIGHLIGHT_ITEM_A'},
                        {id: 'FAKE_HIGHLIGHT_ITEM_B'}
                    ],
                    clustered: []
                };

                getDirective(mockedMapState, false, highlightItems);

                highlightItems.regular.pop();
                $rootScope.$apply();

                expect(highlight.removeMarker).toHaveBeenCalledWith(
                    mockedLeafletMap,
                    {
                        id: 'FAKE_HIGHLIGHT_ITEM_B'
                    }
                );
            });

            it('deletes and re-adds changed icons', function () {
                const highlightItems = {
                    regular: [
                        {id: 'FAKE_HIGHLIGHT_ITEM_A', geometry: 'FAKE_GEOMETRY_A'}
                    ],
                    clustered: []
                };

                getDirective(mockedMapState, false, highlightItems);

                expect(highlight.addMarker).toHaveBeenCalledTimes(1);
                expect(highlight.addMarker).toHaveBeenCalledWith(mockedLeafletMap, {
                    id: 'FAKE_HIGHLIGHT_ITEM_A',
                    geometry: 'FAKE_GEOMETRY_A'
                });
                expect(highlight.removeMarker).not.toHaveBeenCalled();

                // Change the marker
                highlightItems.regular.length = 0;
                highlightItems.regular.push({
                    id: 'FAKE_HIGHLIGHT_ITEM_A',
                    geometry: 'FAKE_GEOMETRY_B'
                });
                $rootScope.$apply();

                expect(highlight.removeMarker).toHaveBeenCalledWith(mockedLeafletMap, {
                    id: 'FAKE_HIGHLIGHT_ITEM_A',
                    geometry: 'FAKE_GEOMETRY_A'
                });

                expect(highlight.addMarker).toHaveBeenCalledWith(mockedLeafletMap, {
                    id: 'FAKE_HIGHLIGHT_ITEM_A',
                    geometry: 'FAKE_GEOMETRY_B'
                });
            });
        });

        describe('that manages clustered markers', function () {
            it('can add a group of clustered markers', function () {
                // Start without any clustered markers
                let highlightItems = {
                    regular: [],
                    clustered: []
                };

                getDirective(mockedMapState, false, highlightItems);
                $rootScope.$apply();
                expect(highlight.setCluster).not.toHaveBeenCalled();

                // Add one marker
                highlightItems.clustered.push([52.1, 4.1], [52.2, 4.1]);
                $rootScope.$apply();
                expect(highlight.setCluster).toHaveBeenCalledWith(
                    mockedLeafletMap,
                    [
                        [52.1, 4.1],
                        [52.2, 4.1]
                    ]
                );
            });

            it('can add a group of clustered markers', function () {
                // Start without any clustered markers
                let highlightItems = {
                    regular: [],
                    clustered: []
                };

                let directive = getDirective(mockedMapState, false, highlightItems);
                $rootScope.$apply();

                // Add one marker
                highlightItems.clustered.push([52.1, 4.1], [52.2, 4.1]);
                // Set loading mode
                directive.isolateScope().mapState.isLoading = true;
                $rootScope.$apply();
                expect(highlight.setCluster).toHaveBeenCalledWith(
                    mockedLeafletMap,
                    [
                        [52.1, 4.1],
                        [52.2, 4.1]
                    ]
                );
            });

            it('can remove a group of clustered markers', function () {
                let highlightItems = {
                    regular: [],
                    clustered: [
                        [52.1, 4.1],
                        [52.2, 4.1]
                    ]
                };

                getDirective(mockedMapState, false, highlightItems);
                $rootScope.$apply();

                // Now remove the clustered markers
                highlightItems.clustered.length = 0;
                $rootScope.$apply();

                expect(highlight.clearCluster).toHaveBeenCalledWith(mockedLeafletMap);
            });
        });
    });

    describe('panning factory', function () {
        beforeEach(function () {
            getDirective(mockedMapState, false, mockedMarkers);
        });

        it('is initialized', function () {
            expect(panning.initialize).toHaveBeenCalledWith(mockedLeafletMap);
        });

        it('is called whenever mapState.viewCenter changes', function () {
            expect(panning.panTo).toHaveBeenCalledTimes(1);
            expect(panning.panTo).toHaveBeenCalledWith(mockedLeafletMap, [52.789, 4.123]);

            mockedMapState.viewCenter = [53, 5];
            $rootScope.$apply();

            expect(panning.panTo).toHaveBeenCalledTimes(2);
            expect(panning.panTo).toHaveBeenCalledWith(mockedLeafletMap, [53, 5]);
        });
    });

    describe('zoom factory', function () {
        beforeEach(function () {
            getDirective(mockedMapState, false, mockedMarkers);
        });

        it('is initialized', function () {
            expect(zoom.initialize).toHaveBeenCalledWith(mockedLeafletMap);
        });

        it('is called whenever mapState.zoom changes', function () {
            expect(zoom.setZoom).toHaveBeenCalledTimes(1);
            expect(zoom.setZoom).toHaveBeenCalledWith(mockedLeafletMap, 12);

            mockedMapState.zoom = 11;
            $rootScope.$apply();

            expect(zoom.setZoom).toHaveBeenCalledTimes(2);
            expect(zoom.setZoom).toHaveBeenCalledWith(mockedLeafletMap, 11);
        });
    });

    it('initializes the onMapClick factory', function () {
        getDirective(mockedMapState, false, mockedMarkers);

        expect(onMapClick.initialize).toHaveBeenCalledWith(mockedLeafletMap);
    });

    describe('resize state', function () {
        it('invalidateSize when resize state changes', function () {
            let mockedResizeArray = ['1', '2'];

            getDirective(mockedMapState, true, mockedMarkers, true, mockedResizeArray);

            expect(mockedLeafletMap.invalidateSize).not.toHaveBeenCalled();

            mockedResizeArray.push('3');
            $rootScope.$apply();

            expect(mockedLeafletMap.invalidateSize).toHaveBeenCalled();
        });
    });

    describe('fullscreen state', function () {
        let directive,
            scope;

        it('is true when fullscreen is set and layers is not', function () {
            mockedMapState.isFullscreen = true;
            directive = getDirective(mockedMapState, false, mockedMarkers);
            scope = directive.isolateScope();
            expect(scope.isFullscreen).toEqual(true);
        });

        it('is false when fullscreen is set and layers is too', function () {
            mockedMapState.isFullscreen = true;
            directive = getDirective(mockedMapState, true, mockedMarkers);
            scope = directive.isolateScope();
            expect(scope.isFullscreen).toEqual(false);
        });

        it('is false when fullscreen is not set', function () {
            mockedMapState.isFullscreen = false;
            directive = getDirective(mockedMapState, false, mockedMarkers);
            scope = directive.isolateScope();
            expect(scope.isFullscreen).toEqual(false);

            mockedMapState.isFullscreen = false;
            directive = getDirective(mockedMapState, true, mockedMarkers);
            scope = directive.isolateScope();
            expect(scope.isFullscreen).toEqual(false);
        });
        it('updates on the fly', function () {
            mockedMapState.isFullscreen = true;
            directive = getDirective(mockedMapState, false, mockedMarkers);
            scope = directive.isolateScope();

            mockedMapState.isFullscreen = false;
            $rootScope.$digest();
            expect(scope.isFullscreen).toEqual(false);

            mockedMapState.isFullscreen = true;
            $rootScope.$digest();
            expect(scope.isFullscreen).toEqual(true);

            scope.showLayerSelection = true;
            $rootScope.$digest();
            expect(scope.isFullscreen).toEqual(false);
        });
    });
});
