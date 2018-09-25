import { toggleStraatbeeldFullscreen } from '../../../../src/shared/ducks/ui/ui';

describe('The dp-toggle-straatbeeld-fullscreen component', function () {
    var $compile,
        $rootScope,
        store,
        scope;

    beforeEach(function () {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () { }
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
        });

        spyOn(store, 'dispatch');
    });

    function getDirective (isFullscreen) {
        var result,
            element;

        element = document.createElement('dp-toggle-straatbeeld-fullscreen');

        element.setAttribute('is-fullscreen', 'isFullscreen');

        scope = $rootScope.$new();
        scope.isFullscreen = isFullscreen;

        result = $compile(element)(scope);
        scope.$apply();

        return result;
    }

    describe ('The fullscreen button for panorama', function () {
        it('can change a window-view straatbeeld to fullscreen', function () {
            // When straatbeeld is small
            const directive = getDirective(false);

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();
            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith(toggleStraatbeeldFullscreen());
        });

        it('can change a fullscreen straatbeeld to window-view', function () {
            const directive = getDirective(true);
            const toggle = directive.find('.qa-toggle-straatbeeld-fullscreen');

            toggle.click();
            $rootScope.$apply();

            store.dispatch(toggleStraatbeeldFullscreen());
        });

        it('sets a screen reader text', () => {
            let component;

            // When the map is small
            component = getDirective(false);
            expect(component.find('.u-sr-only').text()).toBe('Panoramabeeld vergroten');

            // When the map is large
            component = getDirective(true);
            expect(component.find('.u-sr-only').text()).toBe('Panoramabeeld verkleinen');
        });
    });
});
