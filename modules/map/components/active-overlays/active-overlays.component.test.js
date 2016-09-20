describe('The dp-active-overlays component', function () {
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
            },
            function ($provide) {
                $provide.constant('OVERLAYS', {
                    SOURCES: {
                        overlay_a: {
                            minZoom: 8,
                            maxZoom: 16
                        },
                        overlay_b: {
                            minZoom: 10,
                            maxZoom: 14
                        }
                    }
                });

                $provide.factory('dpActiveOverlaysItemDirective', function () {
                    return {};
                });
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

    function getComponent (overlays, zoom, showActiveOverlays) {
        var component,
            element,
            scope;

        element = document.createElement('dp-active-overlays');
        element.setAttribute('overlays', 'overlays');
        element.setAttribute('zoom', 'zoom');
        element.setAttribute('show-active-overlays', 'showActiveOverlays');

        scope = $rootScope.$new();
        scope.overlays = overlays;
        scope.zoom = zoom;
        scope.showActiveOverlays = showActiveOverlays;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('doesn\'t show anything if there are no active overlays', function () {
        var component;

        //Without any overlays
        component = getComponent([], 8, true);
        expect(component.find('.c-toggle-active-overlays').length).toBe(0);
        expect(component.find('.c-active-overlays').length).toBe(0);

        //With overlays
        component = getComponent([{id: 'overlay_a', isVisible: true}], 8, true);
        expect(component.find('.c-toggle-active-overlays').length).toBe(1);
        expect(component.find('.c-active-overlays').length).toBe(1);
    });

    it('toggles between MAP_SHOW_ACTIVE_OVERLAYS and MAP_HIDE_ACTIVE_OVERLAYS', function () {
        var component;

        //With showActiveOverlays is false
        component = getComponent([{id: 'overlay_a', isVisible: true}], 8, false);
        component.find('.c-toggle-active-overlays').click();
        expect(store.dispatch).toHaveBeenCalledTimes(1);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_SHOW_ACTIVE_OVERLAYS
        });

        //With showActiveOverlays is true
        component = getComponent([{id: 'overlay_a', isVisible: true}], 8, true);
        component.find('.c-toggle-active-overlays').click();
        expect(store.dispatch).toHaveBeenCalledTimes(2);
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_HIDE_ACTIVE_OVERLAYS
        });
    });

    it('loads the dp-active-overlays-item components in reversed order', function () {
        var component;

        component = getComponent(
            [{id: 'overlay_a', isVisible: true}, {id: 'overlay_b', isVisible: true}],
            10,
            true
        );

        expect(component.find('dp-active-overlays-item').eq(0).attr('overlay')).toBe('overlay_b');
        expect(component.find('dp-active-overlays-item').eq(1).attr('overlay')).toBe('overlay_a');
    });

    it('the toggle button has a variable alt and title attribute value depending on the state', function () {
        var component;

        //When closed
        component = getComponent(
            [{id: 'overlay_a', isVisible: true}, {id: 'overlay_b', isVisible: true}],
            10,
            false
        );
        expect(component.find('.c-toggle-active-overlays').attr('title')).toBe('Legenda openen');
        expect(component.find('.c-toggle-active-overlays img').attr('alt')).toBe('Legenda openen');

        //When opened
        component = getComponent(
            [{id: 'overlay_a', isVisible: true}, {id: 'overlay_b', isVisible: true}],
            10,
            true
        );
        expect(component.find('.c-toggle-active-overlays').attr('title')).toBe('Legenda sluiten');
        expect(component.find('.c-toggle-active-overlays img').attr('alt')).toBe('Legenda sluiten');

        //When opened; a close icon (dp-link) is shown as well
        expect(component.find('.c-active-overlays button').attr('title')).toBe('Legenda sluiten');
        expect(component.find('.c-toggle-active-overlays__icon').attr('alt')).toBe('Legenda sluiten');
    });
});