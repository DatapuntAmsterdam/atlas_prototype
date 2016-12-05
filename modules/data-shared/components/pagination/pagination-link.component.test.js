describe('The dp-data-shared-pagination-link component', function () {
    const action = 'UPDATE_ACTION';
    var $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpDataShared',
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

        ACTIONS[action] = action;

        spyOn(store, 'dispatch');
    });

    function getComponent (link) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-shared-pagination-link');
        element.setAttribute('link', 'link');
        element.setAttribute('action', action);

        scope = $rootScope.$new();
        scope.link = link;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows a button for each enabled link', function () {
        var component = getComponent({
            label: 'Ik ben een knopske',
            page: 27,
            enabled: true
        });

        expect(component.find('button').length).toBe(1);
        expect(component.find('button').text()).toContain('Ik ben een knopske');

        // The direct descendant selector is needed because Angular adds others <span>'s when transcluding dp-link.
        expect(component.find('> span').length).toBe(0);
    });

    it('triggers the action when clicking a link', function () {
        var component = getComponent({
            label: 'Ik ben een knopske',
            page: 27,
            enabled: true
        });

        component.find('button').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: action,
            payload: 27
        });
    });

    it('hides the button if the link is disabled', function () {
        var component = getComponent({
            label: 'Ik ben een knopske',
            page: 27,
            enabled: false
        });

        expect(component.find('button').length).toBe(0);
    });
});
