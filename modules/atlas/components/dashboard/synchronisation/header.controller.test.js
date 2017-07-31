describe('The header controller', () => {
    var $controller,
        $rootScope,
        store,
        ACTIONS,
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

        angular.mock.inject((_$controller_, _$rootScope_, _store_, _ACTIONS_) => {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedState = {
            map: {
                isFullscreen: false
            },
            search: {
                query: 'i am a search query'
            }
        };
    });

    function getController () {
        const scope = $rootScope.$new();

        const controller = $controller('HeaderController', {
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

    it('sets the search query and action when search is active', () => {
        spyOn(store, 'getState').and.returnValue({
            search: {
                query: 'search query'
            }
        });

        const controller = getController();

        expect(controller.query).toBe('search query');
        expect(controller.searchAction).toEqual(ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY);
    });

    it('sets the dataSelection query and action when datasets are active', () => {
        spyOn(store, 'getState').and.returnValue({
            dataSelection: {
                view: 'CARDS',
                query: 'dataSelection query'
            }
        });

        const controller = getController();

        expect(controller.query).toBe('dataSelection query');
        expect(controller.searchAction).toEqual(ACTIONS.FETCH_DATA_SELECTION);
    });

    it('sets the dataSelection query and action when detail API view is active', () => {
        spyOn(store, 'getState').and.returnValue({
            detail: {
                endpoint: 'somewhere://abc/catalogus/api/xyz'
            }
        });

        const controller = getController();

        expect(controller.query).toBeUndefined();
        expect(controller.searchAction).toEqual(ACTIONS.FETCH_DATA_SELECTION);
    });

    it('default sets the search query and search action', () => {
        spyOn(store, 'getState').and.returnValue({});

        const controller = getController();

        expect(controller.query).toBeUndefined();
        expect(controller.searchAction).toEqual(ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY);
    });

    it('doesn\'t break when search is null', () => {
        mockedState = {
            search: null
        };

        spyOn(store, 'getState').and.returnValue(mockedState);

        const controller = getController();

        expect(controller.query).toBeNull();
    });

    describe('not all states have a print version', () => {
        it('there is no print button when dataSelection is active', () => {
            mockedState.dataSelection = {};

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasPrintButton).toBe(false);
        });

        it('there is no print button on the homepage', () => {
            mockedState.page = {
                name: 'home'
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasPrintButton).toBe(false);
        });

        it('all other pages and non dataSelection content has a printButton', () => {
            mockedState.page = {
                name: 'snel-wegwijs'
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasPrintButton).toBe(true);
        });
    });

    describe('not all states have an embed version', () => {
        it('only in fullscreen map there is an embed button', () => {
            mockedState.map.isFullscreen = true;

            mockedState.page = {
                name: 'home'
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasEmbedButton).toBe(true);
        });

        it('there is no embed button when both full screen map and straatbeeld are active', () => {
            mockedState.map.isFullscreen = true;
            mockedState.straatbeeld = {};

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasEmbedButton).toBe(false);
        });

        it('there is no embed button on the homepage', () => {
            mockedState.page = {
                name: 'home'
            };

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasEmbedButton).toBe(false);
        });
    });
});
