describe('The dp-toggle-straatbeeld-fullscreen component', () => {
    var $compile,
        $rootScope,
        store,
        scope,
        ACTIONS;

    beforeEach(() => {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: function () { }
                }
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _store_, _ACTIONS_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
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

    describe ('The fullscreen button for panorama', () => {
        it('can change a window-view straatbeeld to fullscreen', () => {
            let directive;

            // When straatbeeld is small
            directive = getDirective(false);

            expect(directive.find('.qa-toggle-straatbeeld-fullscreen').attr('class'))
                .toContain('toggle-straatbeeld-fullscreen--maximize');

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();
            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.STRAATBEELD_FULLSCREEN,
                payload: true
            });

            store.dispatch.calls.reset();

            // When straatbeeld is large
            directive = getDirective(true);

            expect(directive.find('.qa-toggle-straatbeeld-fullscreen').attr('class'))
                .toContain('toggle-straatbeeld-fullscreen--minimize');

            directive.find('.qa-toggle-straatbeeld-fullscreen').click();
            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.STRAATBEELD_FULLSCREEN,
                payload: false
            });
        });

        it('can change a fullscreen straatbeeld to window-view', () => {
            const directive = getDirective(true);
            const toggle = directive.find('.qa-toggle-straatbeeld-fullscreen');

            toggle.click();
            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.STRAATBEELD_FULLSCREEN,
                payload: false
            });
        });

        it('sets a screen reader text', () => {
            let component;

            // When the map is small
            component = getDirective(false);
            expect(component.find('.u-sr-only').text()).toBe('Kaart vergroten');

            // When the map is large
            component = getDirective(true);
            expect(component.find('.u-sr-only').text()).toBe('Kaart verkleinen');
        });
    });
});
