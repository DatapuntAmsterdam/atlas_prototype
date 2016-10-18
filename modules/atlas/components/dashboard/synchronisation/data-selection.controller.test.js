describe('The DataSelectionController', function () {
    var $controller,
        $rootScope,
        store,
        mockedState = {
            dataSelection: {
                mocked: 'things',
                some: 'setting'
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
                    getState: function () {}
                }
            }
        );

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        spyOn(store, 'getState').and.returnValue(mockedState);
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('DataSelectionController', {
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

    it('sets the dataSelection based on the state', function () {
        var controller;

        controller = getController();

        expect(controller.dataSelectionState).toEqual({
            mocked: 'things',
            some: 'setting'
        });
    });
});
