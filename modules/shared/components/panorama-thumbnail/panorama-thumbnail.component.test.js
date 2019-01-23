import { routing } from '../../../../src/app/routes';
import { VIEW_MODE } from '../../../../src/shared/ducks/ui/ui';

describe('The dp-panorama-thumbnail component', function () {
    let $compile,
        $rootScope,
        parentScope,
        store;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                sharedConfig: {
                    RADIUS: 50
                },
                store: {
                    getState: angular.noop
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        spyOn(store, 'getState').and.returnValue({
            location: {
                payload: {}
            }
        });
    });

    function getComponent (panorama, isLoading) {
        const element = document.createElement('dp-panorama-thumbnail');
        element.setAttribute('panorama', 'panorama');
        element.setAttribute('is-loading', 'isLoading');

        parentScope = $rootScope.$new();
        parentScope.panorama = panorama;
        parentScope.isLoading = isLoading;

        const component = $compile(element)(parentScope);

        parentScope.$apply();

        return component;
    }

    it('shows a loading indicator when loading', () => {
        const component = getComponent(undefined, true);
        expect(component.find('dp-loading-indicator').length).toBe(1);
        expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');

        expect(component.find('img').length).toBe(0);
        expect(component.find('.qa-found-no-panorama').length).toBe(0);
    });

    it('shows the thumbnail when provided', () => {
        const panorama = {
            url: 'http://example.com/example.png',
            id: 42,
            heading: 99
        };
        const component = getComponent(panorama, false);
        const scope = component.isolateScope();
        expect(component.find('.qa-found-no-panorama').length).toBe(0);
        expect(component.find('img').attr('src')).toBe('http://example.com/example.png');
        expect(component.find('dp-redux-link').attr('to')).toBe('vm.linkTo');
        expect(scope.vm.linkTo).toEqual({
            type: routing.panorama.type,
            payload: { id: 42 },
            meta: { preserve: true, additionalParams: { heading: 99, view: VIEW_MODE.SPLIT } }
        });
        expect(scope.vm.isLoading).toBe(false);
    });

    it('updates the linkTo on new data', () => {
        const panorama = {
            url: 'http://example.com/example.png',
            id: 42,
            heading: 99
        };
        const component = getComponent(panorama, false);
        const scope = component.isolateScope();

        parentScope.panorama = {
            ...panorama,
            id: 43
        };
        parentScope.$digest();

        expect(scope.vm.linkTo).toEqual({
            type: routing.panorama.type,
            payload: { id: 43 },
            meta: { preserve: true, additionalParams: { heading: 99, view: VIEW_MODE.SPLIT } }
        });
    });

    it('when it cannot find a thumbnail it shows a message', function () {
        const component = getComponent(undefined, false);
        const scope = component.isolateScope();

        expect(component.find('img').length).toBe(0);
        expect(scope.vm.isLoading).toBe(false);

        expect(component.find('.qa-found-no-panorama').text())
            .toContain(
                'Geen panoramabeeld beschikbaar (binnen 50m van deze locatie).'
            );
        expect(component.find('.qa-found-no-panorama').text())
            .toContain(
                'Tip: kies via de kaart een nabije locatie.'
            );
    });
});
