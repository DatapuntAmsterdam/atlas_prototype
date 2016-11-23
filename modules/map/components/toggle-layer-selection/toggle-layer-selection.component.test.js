describe('The dp-toggle-layer-selection component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS;

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

    function getComponent (overlays, showLayerSelection) {
        var component,
            element,
            scope;

        element = document.createElement('dp-toggle-layer-selection');
        element.setAttribute('overlays', 'overlays');
        element.setAttribute('show-layer-selection', 'showLayerSelection');

        scope = $rootScope.$new();
        scope.overlays = overlays;
        scope.showLayerSelection = showLayerSelection;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('has a toggle that can trigger both SHOW_LAYER_SELECTION and HIDE_LAYER_SELECTION', function () {
        var component;

        // When showActiveOverlays is false
        component = getComponent([], false);
        component.find('button').click();

        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.SHOW_LAYER_SELECTION
        });

        // When showActiveOverlays is true
        component = getComponent([], true);
        component.find('button').click();

        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.HIDE_LAYER_SELECTION
        });
    });

    it('has different styling depending on showLayerSelection', function () {
        var component;

        // When showActiveOverlays is false
        component = getComponent([], false);
        expect(component.find('.c-toggle-layer-selection').attr('class'))
            .not.toContain('c-toggle-layer-selection--mirrored');

        // When showActiveOverlays is true
        component = getComponent([], true);
        expect(component.find('.c-toggle-layer-selection').attr('class'))
            .toContain('c-toggle-layer-selection--mirrored');
    });

    it('has a different title and alt attribute depending on showLayerSelection', function () {
        var component;

        // When showActiveOverlays is false
        component = getComponent([], false);

        expect(component.find('button').attr('title'))
            .not.toContain('Meer kaartlagen');

        // When showActiveOverlays is true
        component = getComponent([], true);

        expect(component.find('button').attr('title'))
            .toContain('Sluit paneel voor selecteren kaartlagen');
    });
});
