describe('The page controller', () => {
    var $controller,
        $rootScope,
        store,
        mockedState;

    beforeEach(() => {
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

        angular.mock.inject((_$controller_, _$rootScope_, _store_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        mockedState = {
            page: {
                name: 'about-atlas'
            }
        };

        spyOn(store, 'getState').and.callThrough();
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('PageController', {
            $scope: scope
        });

        scope.$apply();

        return controller;
    }

    it('subscribes to the store to listen for changes', () => {
        spyOn(store, 'subscribe').and.callThrough();

        getController();

        expect(store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('sets the pageName based on the state', () => {
        var controller;

        controller = getController();

        expect(controller.pageName).toBe('about-atlas');
    });
});
