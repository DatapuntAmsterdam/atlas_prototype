describe('The dp-toggle-drawing-tool component', function () {
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

    function getComponent (isActive) {
        var result,
            element,
            scope;

        element = document.createElement('dp-toggle-drawing-tool');
        element.setAttribute('enabled', 'isActive');

        scope = $rootScope.$new();
        scope.isActive = isActive;

        result = $compile(element)(scope);
        scope.$apply();

        return result;
    }

    describe('when inactive', function () {
        beforeEach(function () {
            component = getComponent(false);
        });

        it('shows the button in default state', function () {
            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('class')).toContain('c-toggle-drawing-tool');
            expect(component.find('button span').attr('class')).toContain('ng-hide');
        });

        it('triggers the MAP_DRAWING_MODE action w/ payload=true when clicking the button', function () {
            component.find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_DRAWING_MODE,
                payload: true
            });
        });
    });

    describe('when active', function () {
        beforeEach(function () {
            component = getComponent(true);
        });

        it('shows the button in active state with extra label', function () {
            expect(component.find('button').length).toBe(1);
            expect(component.find('button').attr('class')).toContain('c-toggle-drawing-tool--active');
            expect(component.find('button span').attr('class')).not.toContain('ng-hide');
        });

        it('triggers the MAP_DRAWING_MODE action w/ payload=false when clicking the button', function () {
            component.find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_DRAWING_MODE,
                payload: false
            });
        });
    });
});
