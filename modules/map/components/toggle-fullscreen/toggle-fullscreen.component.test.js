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
        var result,
            element,
            scope;

        element = document.createElement('dp-toggle-fullscreen');
        element.setAttribute('is-fullscreen', 'isFullscreen');

        scope = $rootScope.$new();
        scope.isFullscreen = isFullscreen;

        result = $compile(element)(scope);
        scope.$apply();

        return result;
    }

    describe('when minimized', function () {
        beforeEach(function () {
            component = getComponent(false);
        });

        it('shows a maximize icon', function () {
            expect(component.find('button').length).toBe(1);

            expect(component.find('button').attr('class')).toContain('c-toggle-fullscreen__icon--fullscreen');
            expect(component.find('button').attr('title')).toBe('Kaart vergroten');
            expect(component.find('button .u-sr-only').text()).toBe('Kaart vergroten');
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
            expect(component.find('button').length).toBe(1);

            expect(component.find('button').attr('class')).toContain('c-toggle-fullscreen__icon--minimize');
            expect(component.find('button').attr('title')).toBe('Kaart verkleinen');
            expect(component.find('button .u-sr-only').text()).toBe('Kaart verkleinen');
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
