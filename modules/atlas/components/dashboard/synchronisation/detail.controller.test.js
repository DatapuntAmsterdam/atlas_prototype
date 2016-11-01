describe('The detail controller', function () {
    var $controller,
        $rootScope,
        store,
        mockedState = {
            detail: {
                endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                reload: false,
                isLoading: false
            }
        };

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

        spyOn(store, 'getState').and.callThrough();
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('DetailController', {
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

    it('sets the api endpoint and isLoading variables on the scope based on the state', function () {
        var controller;

        controller = getController();

        expect(controller.endpoint).toBe('https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/');
        expect(controller.reload).toBe(false);
        expect(controller.isLoading).toBe(false);
    });

    it('doesn\'t break when detail is null', function () {
        var controller;

        mockedState = {
            detail: null
        };

        controller = getController();

        expect(controller.endpoint).toBeNull();
        expect(controller.isLoading).toBeNull();
        expect(controller.reload).toBeNull();
    });
});
