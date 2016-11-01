describe('The straatbeeld controller', function () {
    var $controller,
        $rootScope,
        store,
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

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        mockedState = {
            straatbeeld: {
                id: 7,
                location: [52.741, 4.852],
                date: new Date(2016, 6, 8),
                hotspots: ['FAKE_HOTSPOT_X', 'FAKE_HOTSPOT_Y', 'FAKE_HOTSPOT_Z'],
                isLoading: false
            }
        };

        spyOn(store, 'getState').and.callThrough();
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

    it('sets the straatbeeldState on the state', function () {
        var controller;

        controller = getController();

        expect(controller.straatbeeldState.id).toBe(7);
        expect(controller.straatbeeldState.date).toEqual(new Date(2016, 6, 8));
        expect(controller.straatbeeldState.location).toEqual([52.741, 4.852]);
        expect(controller.straatbeeldState.hotspots).toEqual(['FAKE_HOTSPOT_X', 'FAKE_HOTSPOT_Y', 'FAKE_HOTSPOT_Z']);
        expect(controller.straatbeeldState.isLoading).toBe(false);
    });

    it('can have a location instead of an ID', function () {
        var controller;

        mockedState = {
            straatbeeld: {
                id: 'ABC',
                isLoading: false
            }
        };

        controller = getController();

        expect(controller.straatbeeldState.id).toBe('ABC');
        expect(controller.straatbeeldState.isLoading).toBe(false);
    });
});
