describe('The dp-map directive', function () {
    var $compile,
        $rootScope,
        L,
        layers,
        highlight,
        panning,
        zoom,
        measure,
        variableWidth,
        searchByClick,
        mockedMapState;

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
                    initialize: function () {},
                    add: function () {},
                    remove: function () {}
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
                searchByClick: {
                    initialize: function () {}
                }
            },

            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });
                $provide.factory('dpMapStatusbarDirective', function () {
                    return {};
                });
                $provide.factory('dpOverlayLegendDirective', function() {
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
            _searchByClick_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                L = _L_;
                layers = _layers_;
                highlight = _highlight_;
                panning = _panning_;
                zoom = _zoom_;
                measure = _measure_;
                variableWidth = _variableWidth_;
                searchByClick = _searchByClick_;
            }
        );

        spyOn(L, 'map').and.returnValue('I_AM_A_FAKE_LEAFLET_MAP');

        spyOn(layers, 'setBaseLayer');
        spyOn(layers, 'addOverlay');
        spyOn(layers, 'removeOverlay');
        spyOn(highlight, 'initialize');
        spyOn(highlight, 'add');
        spyOn(highlight, 'remove');

        spyOn(panning, 'initialize');
        spyOn(panning, 'panTo');
        spyOn(panning, 'setOption');
        spyOn(zoom, 'initialize');
        spyOn(zoom, 'setZoom');
        spyOn(measure, 'initialize');
        spyOn(variableWidth, 'initialize');
        spyOn(searchByClick, 'initialize');

        mockedMapState = {
            baseLayer: 'topografie',
            overlays: [],
            viewCenter: [52.789, 4.123],
            isFullscreen: false,
            zoom: 12
        };
    });

    function getDirective (mapState, markers, useRootScopeApply) {
        var directive,
            element,
            scope;

        element = document.createElement('dp-map');
        element.setAttribute('map-state', 'mapState');
        element.setAttribute('markers', 'markers');

        scope = $rootScope.$new();
        scope.mapState = mapState;
        scope.markers = markers;

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
        getDirective(mockedMapState, [], false);
        expect(L.map).not.toHaveBeenCalled();

        $rootScope.$apply();
        expect(L.map).toHaveBeenCalled();
    });

    it('creates a Leaflet map with options based on both the map state and mapConfig', function () {
        var directive,
            element;

        directive = getDirective(mockedMapState, []);
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
            getDirective(mockedMapState, []);

            expect(layers.setBaseLayer).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'topografie');
        });

        it('changes when the mapState changes', function () {
            getDirective(mockedMapState, []);
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
            getDirective(mockedMapState, []);
            
            expect(layers.addOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
        });

        it('can be added when the mapState changes', function () {
            getDirective(mockedMapState, []);
            expect(layers.addOverlay).not.toHaveBeenCalled();

            mockedMapState.overlays = [{id:'some_overlay', isVisible: true},
                                        {id: 'some_other_overlay', isVisible: true}];
            $rootScope.$apply();

            expect(layers.addOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
            expect(layers.addOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_other_overlay');
        });

        it('can be removed when the mapState changes', function () {
            mockedMapState.overlays = [{id:'some_overlay', isVisible: true},
                                        {id: 'some_other_overlay', isVisible: true}];
            getDirective(mockedMapState, []);

            expect(layers.removeOverlay).not.toHaveBeenCalled();

            mockedMapState.overlays = [];
            $rootScope.$apply();

            expect(layers.removeOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
            expect(layers.removeOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_other_overlay');
        });
        it('can be removed when isVisible changes', function () {
            mockedMapState.overlays = [{id:'some_overlay', isVisible: true},
                                        {id: 'some_other_overlay', isVisible: true}];
            getDirective(mockedMapState, []);

            mockedMapState.overlays = [{id:'some_overlay', isVisible: false},
                                        {id: 'some_other_overlay', isVisible: true}];
            $rootScope.$apply();

            expect(layers.removeOverlay).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_overlay');
            expect(layers.removeOverlay).not.toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', 'some_other_overlay');
        });
    });

    describe('has highlight options', function () {
        it('that gets a call to .initialize() so it can configure Leaflet variables', function () {
            expect(highlight.initialize).not.toHaveBeenCalled();

            getDirective(mockedMapState, []);
            expect(highlight.initialize).toHaveBeenCalled();
        });

        it('can be added on initialisation', function () {
            getDirective(mockedMapState, [{id: 'FAKE_HIGHLIGHT_ITEM_A'}, {id: 'FAKE_HIGHLIGHT_ITEM_B'}]);

            expect(highlight.add).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_A'});
            expect(highlight.add).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_B'});
        });

        it('can be added by changing the input', function () {
            var highlightItems = [{id: 'FAKE_HIGHLIGHT_ITEM_A'}, {id: 'FAKE_HIGHLIGHT_ITEM_B'}];

            getDirective(mockedMapState, highlightItems);

            highlightItems.push({id: 'FAKE_HIGHLIGHT_ITEM_C'});
            $rootScope.$apply();

            expect(highlight.add).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_C'});
        });

        it('can be removed from the map', function () {
            var highlightItems = [{id: 'FAKE_HIGHLIGHT_ITEM_A'}, {id: 'FAKE_HIGHLIGHT_ITEM_B'}];

            getDirective(mockedMapState, highlightItems);

            highlightItems.pop();
            $rootScope.$apply();

            expect(highlight.remove).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {id: 'FAKE_HIGHLIGHT_ITEM_B'});
        });

        it('deletes and re-adds changed icons', function () {
            var highlightItems = [{id: 'FAKE_HIGHLIGHT_ITEM_A', geometry: 'FAKE_GEOMETRY_A'}];

            getDirective(mockedMapState, highlightItems);

            expect(highlight.add).toHaveBeenCalledTimes(1);
            expect(highlight.add).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {
                id: 'FAKE_HIGHLIGHT_ITEM_A',
                geometry: 'FAKE_GEOMETRY_A'
            });
            expect(highlight.remove).not.toHaveBeenCalled();

            //Change the marker
            highlightItems.length = 0;
            highlightItems.push({
                id: 'FAKE_HIGHLIGHT_ITEM_A',
                geometry: 'FAKE_GEOMETRY_B'
            });
            $rootScope.$apply();

            expect(highlight.remove).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {
                id: 'FAKE_HIGHLIGHT_ITEM_A',
                geometry: 'FAKE_GEOMETRY_A'
            });

            expect(highlight.add).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP', {
                id: 'FAKE_HIGHLIGHT_ITEM_A',
                geometry: 'FAKE_GEOMETRY_B'
            });
        });
    });

    describe('panning factory', function () {
        var directive,
            container;

        beforeEach(function () {
            directive = getDirective(mockedMapState, []);
            container = directive[0].querySelector('.js-leaflet-map');
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
            getDirective(mockedMapState, []);
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
        getDirective(mockedMapState, []);

        expect(measure.initialize).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
    });

    it('initializes the variableWidth factory', function () {
        var directive,
            container;

        directive = getDirective(mockedMapState, []);
        container = directive[0].querySelector('.js-leaflet-map');

        expect(variableWidth.initialize).toHaveBeenCalledWith(container, 'I_AM_A_FAKE_LEAFLET_MAP');
    });

    it('initializes the searchByClick factory', function () {
        getDirective(mockedMapState, []);

        expect(searchByClick.initialize).toHaveBeenCalledWith('I_AM_A_FAKE_LEAFLET_MAP');
    });
});