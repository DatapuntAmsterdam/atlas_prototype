describe('The header controller', function () {
    var $controller,
        $rootScope,
        store,
        mockedState,
        DEFAULT_STATE;

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

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_, _DEFAULT_STATE_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
            DEFAULT_STATE = _DEFAULT_STATE_;
        });

        mockedState = {
            search: {
                query: 'i am a search query'
            }
        };
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('HeaderController', {
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

    it('sets the query string based on the state', function () {
        var controller;

        spyOn(store, 'getState').and.returnValue(mockedState);

        controller = getController();

        expect(controller.query).toBe('i am a search query');
    });

    it('doesn\'t break when search is null', function () {
        var controller;

        mockedState = {
            search: null
        };

        spyOn(store, 'getState').and.returnValue(mockedState);

        controller = getController();

        expect(controller.query).toBeNull();
    });

    describe('not all states have a print version', function () {
        it('there is no print button when dataSelection is active', function () {
            var controller;

            mockedState.dataSelection = {};

            spyOn(store, 'getState').and.returnValue(mockedState);
            controller = getController();

            expect(controller.hasPrintButton).toBe(false);
        });

        it('all non dataSelection modules have a printButton', function () {
            var controller;

            spyOn(store, 'getState').and.returnValue(DEFAULT_STATE);
            controller = getController();

            expect(controller.hasPrintButton).toBe(true);
        });
    });
});
