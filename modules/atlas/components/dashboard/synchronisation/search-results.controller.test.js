describe('The searchResults controller', function () {
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
            search: {
                query: 'i am a search query',
                location: null
            }
        };

        spyOn(store, 'getState').and.callThrough();
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('SearchResultsController', {
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

        controller = getController();

        expect(controller.query).toBe('i am a search query');
        expect(controller.location).toBeNull();
    });

    it('sets the location based on the state', function () {
        var controller;

        mockedState = {
            search: {
                query: null,
                location: [52.123, 4.789]
            }
        };

        controller = getController();

        expect(controller.query).toBeNull();
        expect(controller.location).toEqual([52.123, 4.789]);
    });

    it('sets the category based on the state', function () {
        var controller;

        mockedState = {
            search: {
                query: 'i am a search query',
                location: null,
                category: 'adres'
            }
        };

        controller = getController();

        expect(controller.category).toBe('adres');
    });

    it('sets isLoading based on the state', function () {
        var controller;

        mockedState.search.isLoading = true;

        controller = getController();

        expect(controller.isLoading).toBe(true);
    });

    it('sets the number of results based on the state', function () {
        var controller;

        mockedState.search.numberOfResults = 23;

        controller = getController();

        expect(controller.numberOfResults).toBe(23);
    });

    it('doesn\'t break if search is null', function () {
        var controller;

        mockedState = {
            search: null
        };

        controller = getController();

        expect(controller.isLoading).toBeUndefined();
        expect(controller.query).toBeUndefined();
        expect(controller.location).toBeUndefined();
        expect(controller.category).toBeUndefined();
        expect(controller.numberOfResults).toBeUndefined();
    });
});
