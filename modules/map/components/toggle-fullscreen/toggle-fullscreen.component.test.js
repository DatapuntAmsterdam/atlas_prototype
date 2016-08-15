describe('The dp-toggle-fullscreen component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS,
        component;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent (isFullscreen) {
        var component,
            element,
            scope;

        element = document.createElement('dp-toggle-fullscreen');
        element.setAttribute('is-fullscreen', 'isFullscreen');

        scope = $rootScope.$new();
        scope.isFullscreen = isFullscreen;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('when minimized', function () {
        beforeEach(function () {
            component = getComponent(false);
        });

        it('shows a maximize icon', function () {
            expect(component.find('button img').length).toBe(1);

            expect(component.find('button img').attr('src')).toContain('assets/icons/fullscreen.svg');
            expect(component.find('button img').attr('alt')).toBe('Kaart vergroten');
        });

        it('triggers the MAP_FULLSCREEN action w/ payload=true when clicking the button', function () {
            component.find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_FULLSCREEN,
                payload: true
            });
        });
    });

    describe('when maximized', function () {
        beforeEach(function () {
            component = getComponent(true);
        });

        it('shows a minimize icon', function () {
            expect(component.find('button img').length).toBe(1);

            expect(component.find('button img').attr('src')).toContain('assets/icons/min.svg');
            expect(component.find('button img').attr('alt')).toBe('Kaart verkleinen');
        });

        it('triggers the MAP_FULLSCREEN action w/ payload=false when clicking the button', function () {
            component.find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_FULLSCREEN,
                payload: false
            });
        });
    });
});