describe('The map controller', function () {
    var $controller,
        $rootScope,
        store,
        crsConverter;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_, _crsConverter_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
            crsConverter = _crsConverter_;
        });

        spyOn(crsConverter, 'wgs84ToRd').and.returnValue('FAKE_RD_COORDINATES');
    });

    function getController () {
        var controller,
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
        var mockedState = {
                map: {
                    var_1: 'a',
                    var_2: 'b'
                }
            },
            controller;

        spyOn(store, 'getState').and.returnValue(mockedState);

        controller = getController();

        expect(controller.mapState).toEqual({
            var_1: 'a',
            var_2: 'b'
        });
    });

    describe('optionally adds marker data for search by location, detail and panorama', function () {
        var mockedState,
            controller;

        it('can work without any markers', function () {
            mockedState = {};

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            expect(controller.markers).toEqual([]);
        });

        it('supports a search marker', function () {
            mockedState = {
                search: {
                    location: [52.1, 4.1]
                }
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'search'
            }));
        });

        it('supports a detail marker', function () {
            mockedState = {
                detail: {
                    geometry: 'FAKE_GEOMETRY'
                }
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'detail'
            }));
        });

        it('supports a panorama marker', function () {
            mockedState = {
                panorama: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            //Panorama is secretly made using two icons
            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_orientation'
            }));

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_person'
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
                panorama: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            //Panorama is secretly made using two icons

            //Search and panorama are in WGS84 and will be converted to RD
            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'search',
                geometry: {
                    type: 'Point',
                    coordinates: 'FAKE_RD_COORDINATES'
                }
            }));

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_orientation',
                geometry: {
                    type: 'Point',
                    coordinates: 'FAKE_RD_COORDINATES'
                }
            }));

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_person',
                geometry: {
                    type: 'Point',
                    coordinates: 'FAKE_RD_COORDINATES'
                }
            }));

            //Detail already is in RD and won't be converted
            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'detail',
                geometry: 'FAKE_RD_GEOMETRY'
            }));
        });

        it('The panorama_orientation icon will have a extra variable for leaflet-rotatedmarker', function () {
            mockedState = {
                panorama: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_orientation',
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
                panorama: {
                    location: [52.2, 4.2],
                    heading: 179
                }
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'search',
                useAutoFocus: false
            }));

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'detail',
                useAutoFocus: true
            }));

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_orientation',
                useAutoFocus: false
            }));

            expect(controller.markers).toContain(jasmine.objectContaining({
                id: 'panorama_person',
                useAutoFocus: false
            }));
        });
    });
});