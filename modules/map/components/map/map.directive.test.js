describe('The dp-map directive', () => {
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
        mockedMarkers,
        DRAW_TOOL_CONFIG;

    beforeEach(() => {
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
                },
                user: {
                    getAuthorizationLevel: angular.noop
                },
                overlays: {
                    SOURCES: {
                        'some_overlay': 'some_overlay',
                        'some_other_overlay': 'some_other_overlay'
                    }
                }
            },

            $provide => {
                $provide.factory('dpLinkDirective', () => ({}));

                $provide.factory('dpToggleLayerSelectionDirective', () => ({}));

                $provide.factory('dpDrawToolDirective' + '', () => ({}));

                $provide.factory('dpActiveOverlaysDirective', () => ({}));

                $provide.factory('dpToggleFullscreenDirective', () => ({}));

                $provide.factory('dpEmbedButtonDirective', () => ({}));
            }
        );
        mockedLeafletMap = {
            invalidateSize: angular.noop
        };

        angular.mock.inject((
            _$compile_,
            _$rootScope_,
            _L_,
            _layers_,
            _highlight_,
            _panning_,
            _zoom_,
            _drawTool_,
            _onMapClick_,
            _DRAW_TOOL_CONFIG_
        ) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            L = _L_;
            layers = _layers_;
            highlight = _highlight_;
            panning = _panning_;
            zoom = _zoom_;
            drawTool = _drawTool_;
            onMapClick = _onMapClick_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
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
        const element = document.createElement('dp-map');
        element.setAttribute('map-state', 'mapState');
        element.setAttribute('markers', 'markers');
        element.setAttribute('show-layer-selection', 'showLayerSelection');
        element.setAttribute('resize', 'resize');

        const scope = $rootScope.$new();
        scope.mapState = mapState;
        scope.markers = markers;
        scope.resize = resize;
        scope.showLayerSelection = showLayerSelection;

        const directive = $compile(element)(scope);

        scope.$apply();

        if (angular.isUndefined(useRootScopeApply) || useRootScopeApply) {
            $rootScope.$apply();
        }

        return directive;
    }

    it('doesn\'t initialize until the next digest cycle', () => {
        /**
         * This is needed to ensure that the map has a width. To have a width it needs to be appended to the DOM. And
         * adding to the DOM happens the next digest cycle.
         */
        getDirective(mockedMapState, false, mockedMarkers, false);
        expect(L.map).not.toHaveBeenCalled();

        $rootScope.$apply();
        expect(L.map).toHaveBeenCalled();
    });

    it('creates a Leaflet map with options based on both the map state and mapConfig', () => {
        const directive = getDirective(mockedMapState, false, mockedMarkers);
        const element = directive.find('.qa-leaflet-map');

        expect(L.map).toHaveBeenCalledWith(element[0], {
            center: [52.789, 4.123],
            zoom: 12,
            doThisThing: false,
            someVariable: 4
        });
    });

    describe('has a base layer which', () => {
        it('is set on initialization', () => {
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.setBaseLayer).toHaveBeenCalledWith(mockedLeafletMap, 'topografie');
        });

        it('changes when the mapState changes', () => {
            getDirective(mockedMapState, false, mockedMarkers);
            expect(layers.setBaseLayer).toHaveBeenCalledTimes(1);

            mockedMapState.baseLayer = 'luchtfoto_2015';
            $rootScope.$apply();

            expect(layers.setBaseLayer).toHaveBeenCalledTimes(2);
            expect(layers.setBaseLayer).toHaveBeenCalledWith(mockedLeafletMap, 'luchtfoto_2015');
        });
    });

    describe('has overlays which', () => {
        let user,
            overlays;

        beforeEach(() => {
            angular.mock.inject((_overlays_, _user_) => {
                overlays = _overlays_;
                user = _user_;
            });
        });

        it('can be added on initialization', () => {
            mockedMapState.overlays = [{id: 'some_overlay', isVisible: true}];
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.addOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_overlay');
        });

        it('can be removed on initialization', () => {
            mockedMapState.overlays = [{id: 'some_overlay', isVisible: false}];
            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.removeOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_overlay');
        });

        it('can be added when the mapState changes', () => {
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

        it('can be removed when the mapState changes', () => {
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

        it('is updated when the user authorization level changes', () => {
            mockedMapState.overlays = [
                {id: 'some_overlay', isVisible: true},
                {id: 'some_other_overlay', isVisible: true}
            ];
            spyOn(user, 'getAuthorizationLevel').and.returnValue(1);

            getDirective(mockedMapState, false, mockedMarkers);

            expect(layers.removeOverlay).not.toHaveBeenCalled();

            user.getAuthorizationLevel.and.returnValue(2);
            overlays.SOURCES = {
                'some_overlay': 'some_overlay'  // the other overlay is removed for  this auth level
            };

            $rootScope.$digest();

            expect(layers.removeOverlay).toHaveBeenCalledWith(mockedLeafletMap, 'some_other_overlay');
        });

        it('can be removed when isVisible changes', () => {
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

    describe('has highlight options', () => {
        it('that gets a call to .initialize() so it can configure Leaflet variables', () => {
            expect(highlight.initialize).not.toHaveBeenCalled();

            getDirective(mockedMapState, false, mockedMarkers);
            expect(highlight.initialize).toHaveBeenCalled();
        });

        describe('that manage individual markers', () => {
            it('can be added on initialisation', () => {
                getDirective(mockedMapState, false, {
                    regular: [{id: 'FAKE_HIGHLIGHT_ITEM_A'}, {id: 'FAKE_HIGHLIGHT_ITEM_B'}],
                    clustered: []
                });

                expect(highlight.addMarker)
                    .toHaveBeenCalledWith(mockedLeafletMap, {id: 'FAKE_HIGHLIGHT_ITEM_A'});
                expect(highlight.addMarker)
                    .toHaveBeenCalledWith(mockedLeafletMap, {id: 'FAKE_HIGHLIGHT_ITEM_B'});
            });

            it('can be added by changing the input', () => {
                const highlightItems = {
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

            it('can be removed from the map', () => {
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

            it('deletes and re-adds changed icons', () => {
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

        describe('that manages clustered markers', () => {
            it('can add a group of clustered markers', () => {
                // Start without any clustered markers
                const highlightItems = {
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

            it('can remove a group of clustered markers', () => {
                const highlightItems = {
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

    describe('panning factory', () => {
        beforeEach(() => {
            getDirective(mockedMapState, false, mockedMarkers);
        });

        it('is initialized', () => {
            expect(panning.initialize).toHaveBeenCalledWith(mockedLeafletMap);
        });

        it('is called whenever mapState.viewCenter changes', () => {
            expect(panning.panTo).toHaveBeenCalledTimes(1);
            expect(panning.panTo).toHaveBeenCalledWith(mockedLeafletMap, [52.789, 4.123]);

            mockedMapState.viewCenter = [53, 5];
            $rootScope.$apply();

            expect(panning.panTo).toHaveBeenCalledTimes(2);
            expect(panning.panTo).toHaveBeenCalledWith(mockedLeafletMap, [53, 5]);
        });
    });

    describe('zoom factory', () => {
        beforeEach(() => {
            getDirective(mockedMapState, false, mockedMarkers);
        });

        it('is initialized', () => {
            expect(zoom.initialize).toHaveBeenCalledWith(mockedLeafletMap);
        });

        it('is called whenever mapState.zoom changes', () => {
            expect(zoom.setZoom).toHaveBeenCalledTimes(1);
            expect(zoom.setZoom).toHaveBeenCalledWith(mockedLeafletMap, 12);

            mockedMapState.zoom = 11;
            $rootScope.$apply();

            expect(zoom.setZoom).toHaveBeenCalledTimes(2);
            expect(zoom.setZoom).toHaveBeenCalledWith(mockedLeafletMap, 11);
        });
    });

    it('initializes the onMapClick factory', () => {
        getDirective(mockedMapState, false, mockedMarkers);

        expect(onMapClick.initialize).toHaveBeenCalledWith(mockedLeafletMap);
    });

    describe('resize state', () => {
        it('invalidateSize when resize state changes', () => {
            const mockedResizeArray = ['1', '2'];

            getDirective(mockedMapState, true, mockedMarkers, true, mockedResizeArray);

            expect(mockedLeafletMap.invalidateSize).not.toHaveBeenCalled();

            mockedResizeArray.push('3');
            $rootScope.$apply();

            expect(mockedLeafletMap.invalidateSize).toHaveBeenCalled();
        });
    });

    describe('draw state', () => {
        it('should set the draw mode to none when drawing and editing are not active', () => {
            mockedMapState.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.NONE;

            const directive = getDirective(mockedMapState, false, mockedMarkers);
            const element = directive.find('.qa-map-container');

            expect(element.attr('class')).toContain('c-map--drawing-mode-none');
        });

        it('should set the draw mode to draw when drawing is active', () => {
            mockedMapState.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW;

            const directive = getDirective(mockedMapState, false, mockedMarkers);
            const element = directive.find('.qa-map-container');

            expect(element.attr('class')).toContain('c-map--drawing-mode-draw');
        });

        it('should set the draw mode to draw when editing is active', () => {
            mockedMapState.drawingMode = DRAW_TOOL_CONFIG.DRAWING_MODE.EDIT;

            const directive = getDirective(mockedMapState, false, mockedMarkers);
            const element = directive.find('.qa-map-container');

            expect(element.attr('class')).toContain('c-map--drawing-mode-edit');
        });
    });
});
