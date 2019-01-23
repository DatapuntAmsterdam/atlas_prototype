import PAGES from '../../../src/app/pages';
import { ROUTER_NAMESPACE } from '../../../src/app/routes';
import * as ui from '../../../src/shared/ducks/ui/ui';

describe('The header controller', function () {
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
            location: {
                type: `${ROUTER_NAMESPACE}/${PAGES.PANORAMA}`
            },
            search: {
                query: 'i am a search query'
            }
        };

        ui.hasPrintMode = () => false;
        ui.isMapActive = () => true;
    });

    function getController () {
        const scope = $rootScope.$new();

        const controller = $controller('HeaderController', {
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

    it('doesn\'t break when search is null', function () {
        mockedState = {
            search: null
        };

        spyOn(store, 'getState').and.returnValue(mockedState);

        const controller = getController();

        expect(controller.query).toBeUndefined();
    });

    describe('not all states have a print version', function () {
        it('there is no print button when dataSelection is active', function () {
            mockedState.dataSelection = {};

            spyOn(store, 'getState').and.returnValue(mockedState);
            const controller = getController();

            expect(controller.hasPrintButton).toBe(false);
        });

        it('there is no print button on the homepage', () => {
            const controller = getController();

            expect(controller.hasPrintButton).toBe(false);
        });

        it('all other pages and non dataSelection content has a printButton', function () {
            ui.hasPrintMode = () => true;

            const controller = getController();

            expect(controller.hasPrintButton).toBe(true);
        });
    });

    describe('not all states have an embed version', function () {
        it('only in fullscreen map there is an embed button', function () {
            const controller = getController();

            expect(controller.hasEmbedButton).toBe(true);
        });

        it('should not show when map page is not active', function () {
            ui.isMapActive = () => false;
            const controller = getController();

            expect(controller.hasEmbedButton).toBe(false);
        });
    });
});
