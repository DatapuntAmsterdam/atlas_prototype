describe('The map controller', function () {
    let $controller,
        $rootScope,
        store,
        crsConverter,
        mockedState;

    beforeEach(function () {
        angular.mock.module(
            'atlas',
            {
                store: {
                    subscribe: function (callbackFn) {
                        callbackFn();
                    },
                    getState: function () {
                        return mockedState;
                    }
                }
            }
        );

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_, _crsConverter_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
            crsConverter = _crsConverter_;
        });

        mockedState = {
            map: {
                var_1: 'a',
                var_2: 'b'
            },
            layerSelection: {}
        };

        spyOn(store, 'getState').and.callThrough();
        spyOn(crsConverter, 'wgs84ToRd').and.returnValue('FAKE_RD_COORDINATES');
    });

    function getController () {
        let controller,
            scope = $rootScope.$new();

        controller = $controller('MapController', {
            $scope: scope
        });

        scope.$apply();

        return controller;
    }

    it('subscribes to the store to listen for changes', function () {
        spyOn(store, 'subscribe').and.callThrough();

        getController();

        expect(store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('sets the mapState based on the Redux state', function () {
        let controller;

        controller = getController();

        expect(controller.mapState).toEqual({
            var_1: 'a',
            var_2: 'b'
        });
    });

    it('sets the showLayerSelection based on the Redux state', function () {
        let controller;

        controller = getController();
        expect(controller.showLayerSelection).not.toEqual(true);

        mockedState.layerSelection.isEnabled = true;
        controller = getController();
        expect(controller.showLayerSelection).toEqual(true);
    });

    describe('optionally adds marker data for search by location, detail and straatbeeld', function () {
        let controller;

        it('can work without any markers', function () {
            mockedState = {};

            controller = getController();

            expect(controller.markers.regular).toEqual([]);
            expect(controller.markers.clustered).toEqual([]);
        });

        it('supports a search marker', function () {
            mockedState = {
                search: {
                    location: [52.1, 4.1]
                }
            };

            controller = getController();

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'search'
            }));
        });

        it('supports a detail marker', function () {
            mockedState = {
                detail: {
                    geometry: 'FAKE_GEOMETRY'
                }
            };

            controller = getController();

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'detail'
            }));
        });

        it('supports a straatbeeld marker', function () {
            mockedState = {
                straatbeeld: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            controller = getController();

            // Straatbeeld is secretly made using two icons
            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_orientation'
            }));

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_person'
            }));
        });

        it('converts each WGS84 Point to geoJSON with the RD notation', function () {
            mockedState = {
                search: {
                    location: [52.1, 4.1]
                },
                detail: {
                    geometry: 'FAKE_RD_GEOMETRY'
                },
                straatbeeld: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            controller = getController();

            // Straatbeeld is secretly made using two icons

            // Search and straatbeeld are in WGS84 and will be converted to RD
            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'search',
                geometry: {
                    type: 'Point',
                    coordinates: 'FAKE_RD_COORDINATES'
                }
            }));

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_orientation',
                geometry: {
                    type: 'Point',
                    coordinates: 'FAKE_RD_COORDINATES'
                }
            }));

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_person',
                geometry: {
                    type: 'Point',
                    coordinates: 'FAKE_RD_COORDINATES'
                }
            }));

            // Detail already is in RD and won't be converted
            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'detail',
                geometry: 'FAKE_RD_GEOMETRY'
            }));
        });

        it('The straatbeeld_orientation icon will have a extra variable for leaflet-rotatedmarker', function () {
            mockedState = {
                straatbeeld: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_orientation',
                orientation: 179
            }));
        });

        it('sets useAutoFocus to true for detail page geometry (and false for everything else)', function () {
            mockedState = {
                search: {
                    location: [52.1, 4.1]
                },
                detail: {
                    geometry: 'FAKE_RD_GEOMETRY'
                },
                straatbeeld: {
                    location: [52.2, 4.2],
                    heading: 179
                },
                layerSelection: {}
            };

            controller = getController();

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'search',
                useAutoFocus: false
            }));

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'detail',
                useAutoFocus: true
            }));

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_orientation',
                useAutoFocus: false
            }));

            expect(controller.markers.regular).toContain(jasmine.objectContaining({
                id: 'straatbeeld_person',
                useAutoFocus: false
            }));
        });
    });

    it('optionally adds clustered markers', function () {
        let controller;

        // Without clustered markers
        controller = getController();
        expect(controller.markers.clustered).toEqual([]);

        // With clustered markers
        mockedState.dataSelection = {
            markers: [
                [51.0, 4.0],
                [51.1, 4.0],
                [51.1, 4.2]
            ]
        };
        controller = getController();
        expect(controller.markers.clustered).toEqual([
            [51.0, 4.0],
            [51.1, 4.0],
            [51.1, 4.2]
        ]);
    });
});
