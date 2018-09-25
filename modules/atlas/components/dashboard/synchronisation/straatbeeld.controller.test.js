import PAGES from '../../../../../src/pages';

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
            ui: {
                page: PAGES.HOME
            },
            straatbeeld: {
                id: 7
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
    });

    it('is not fullscreen when not on panorama page', function () {
        const controller = getController();
        expect(controller.isFullscreen).toBe(false);
    });

    it('is fullscreen on panorama page', function () {
        mockedState.ui.page = PAGES.PANORAMA;
        const controller = getController();
        expect(controller.isFullscreen).toBe(true);
    });
});
