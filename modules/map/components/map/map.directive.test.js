describe('The dp-map directive', function () {
    let $compile,
        $rootScope,
        L,
        layers,
        highlight,
        panning,
        zoom,
        measure,
        variableWidth,
        onMapClick,
        mockedMapState,
        mockedMarkers;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
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
                    initialize: function () {},
                    panTo: function () {},
                    setOption: function () {}
                },
                zoom: {
                    initialize: function () {},
                    setZoom: function () {}
                },
                measure: {
                    initialize: function () {}
                },
                onMapClick: {
                    initialize: function () {}
                }
            },

            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });

                $provide.factory('dpToggleLayerSelectionDirective', function () {
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

        angular.mock.inject(function (
            _$compile_,
            _$rootScope_,
            _L_,
            _layers_,
            _highlight_,
            _panning_,
            _zoom_,
            _measure_,
            _variableWidth_,
            _onMapClick_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            L = _L_;
            layers = _layers_;
            highlight = _highlight_;
            panning = _panning_;
            zoom = _zoom_;
            measure = _measure_;
            variableWidth = _variableWidth_;
            onMapClick = _onMapClick_;
        });

        spyOn(L, 'map').and.returnValue('I_AM_A_FAKE_LEAFLET_MAP');

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
        spyOn(measure, 'initialize');
        spyOn(variableWidth, 'initialize');
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

    function getDirective (mapState, showLayerSelection, markers, useRootScopeApply) {
        let directive,
            element,
            scope;

        element = document.createElement('dp-map');
        element.setAttribute('map-state', 'mapState');
        element.setAttribute('markers', 'markers');
        element.setAttribute('show-layer-selection', 'showLayerSelection');

        scope = $rootScope.$new();
        scope.mapState = mapState;
        scope.markers = markers;
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

            expect(layers.setBaseLayer).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'topografie');
        });

        it('changes when the mapState changes', function () {
            getDirective(mockedMapState, false, mockedMarkers);
            expect(layers.setBaseLayer).toHaveBeenCalledTimes(1);

            mockedMapState.baseLayer = 'luchtfoto_2015';
            $rootScope.$apply();

            expect(layers.setBaseLayer).toHaveBeenCalledTimes(2);
            expect(layers.setBaseLayer).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'luchtfoto_2015');
        });
    });

    describe('has overlays which', function () {
        it('can be added on initialization', function () {
            mockedMapState.overlays = [{id: 'some_overlay', isVisible: true}];
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.addOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
        });

        it('can be added when the mapState changes', function () {
            getDirective(mockedMapState, false, mockedMarkers);
            expect(layers.addOverlay).not.toHaveBeenCalled();

            mockedMapState.overlays = [
                {id: 'some_overlay', isVisible: true},
                {id: 'some_other_overlay', isVisible: true}
            ];
            $rootScope.$apply();

            expect(layers.addOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
            expect(layers.addOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_other_overlay');
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

            expect(layers.removeOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
            expect(layers.removeOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_other_overlay');
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

            expect(layers.removeOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
            expect(layers.removeOverlay).not.toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_other_overlay');
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
                    .toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_A'});
                expect(highlight.addMarker)
                    .toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_B'});
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
                    .toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_C'});
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
                    'I_AM_A_FAKE_LEAFLET_MAP',
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
                expect(highlight.addMarker).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {
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

                expect(highlight.removeMarker).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {
                    id: 'FAKE_HIGHLIGHT_ITEM_A',
                    geometry: 'FAKE_GEOMETRY_A'
                });

                expect(highlight.addMarker).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {
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
                    'I_AM_A_FAKE_LEAFLET_MAP',
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
                    'I_AM_A_FAKE_LEAFLET_MAP',
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

                expect(highlight.clearCluster).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
            });
        });
    });

    describe('panning factory', function () {
        beforeEach(function () {
            getDirective(mockedMapState, false, mockedMarkers);
        });

        it('is initialized', function () {
            expect(panning.initialize).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
        });

        it('is called whenever mapState.viewCenter changes', function () {
            expect(panning.panTo).toHaveBeenCalledTimes(1);
            expect(panning.panTo).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', [52.789, 4.123]);

            mockedMapState.viewCenter = [53, 5];
            $rootScope.$apply();

            expect(panning.panTo).toHaveBeenCalledTimes(2);
            expect(panning.panTo).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', [53, 5]);
        });
    });

    describe('zoom factory', function () {
        beforeEach(function () {
            getDirective(mockedMapState, false, mockedMarkers);
        });

        it('is initialized', function () {
            expect(zoom.initialize).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
        });

        it('is called whenever mapState.zoom changes', function () {
            expect(zoom.setZoom).toHaveBeenCalledTimes(1);
            expect(zoom.setZoom).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 12);

            mockedMapState.zoom = 11;
            $rootScope.$apply();

            expect(zoom.setZoom).toHaveBeenCalledTimes(2);
            expect(zoom.setZoom).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 11);
        });
    });

    it('initializes the measure factory', function () {
        getDirective(mockedMapState, false, mockedMarkers);

        expect(measure.initialize).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
    });

    it('initializes the variableWidth factory', function () {
        let directive,
            container;

        directive = getDirective(mockedMapState, false, mockedMarkers);
        container = directive[0].querySelector('.js-leaflet-map');

        expect(variableWidth.initialize).toHaveBeenCalledWith(container, 'I_AM_A_FAKE_LEAFLET_MAP');
    });

    it('initializes the onMapClick factory', function () {
        getDirective(mockedMapState, false, mockedMarkers);

        expect(onMapClick.initialize).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
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
