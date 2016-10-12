describe('The straatbeeld controller', function () {
    var $controller,
        $rootScope,
        store;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
        });
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('StraatbeeldController', {
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

    it('sets the id, date, camera, hotspots and isLoading indicator based on the state', function () {
        var mockedState = {
                straatbeeld: {
                    id: 7,
                    searchLocation: null,
                    date: new Date(2016, 6, 8),
                    camera: {
                        location: [52.741, 4.852]
                    },
                    hotspots: ['FAKE_HOTSPOT_X', 'FAKE_HOTSPOT_Y', 'FAKE_HOTSPOT_Z'],
                    isLoading: false
                }
            },
            controller;

        spyOn(store, 'getState').and.returnValue(mockedState);

        controller = getController();

        expect(controller.straatbeeldState.id).toBe(7);
        expect(controller.straatbeeldState.searchLocation).toBeNull();
        expect(controller.straatbeeldState.date).toEqual(new Date(2016, 6, 8));
        expect(controller.straatbeeldState.camera).toEqual({
            location: [52.741, 4.852]
        });
        expect(controller.straatbeeldState.hotspots).toEqual(['FAKE_HOTSPOT_X', 'FAKE_HOTSPOT_Y', 'FAKE_HOTSPOT_Z']);
        expect(controller.straatbeeldState.isLoading).toBe(false);
    });

    it('can have a location instead of an ID', function () {
        var mockedState = {
                straatbeeld: {
                    id: null,
                    searchLocation: [52.456, 4.321],
                    date: new Date(2016, 6, 8),
                    camera: {
                        location: [52.741, 4.852]
                    },
                    isLoading: false
                }
            },
            controller;

        spyOn(store, 'getState').and.returnValue(mockedState);

        controller = getController();

        expect(controller.straatbeeldState.id).toBeNull();
        expect(controller.straatbeeldState.searchLocation).toEqual([52.456, 4.321]);
    });
});
