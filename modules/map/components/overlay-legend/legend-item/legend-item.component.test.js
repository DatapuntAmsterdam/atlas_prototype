describe('The atlas statusbar component', function() {
	var $compile,
        $rootScope,
        ACTIONS,
        store;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.constant('mapConfig', {
                    OVERLAY_ROOT: 'http://locallegend.local'
                });
                $provide.constant('OVERLAYS', {
                    SOURCES: {
                        overlay_1_a: {
                            label_long: 'Overlay 1a',
                            label_short: 'Ov-1a',
                            minZoom: 8,
                            maxZoom: 16,
                            legend: '/legends/over1a'
                        },
                        overlay_1_b: {
                            label_long: 'Overlay 1b',
                            label_short: 'Overlay 1b',
                            minZoom: 8,
                            maxZoom: 16,
                            legend: 'http://external.local/legends/over1a',
                            external: true,
                        },
                        overlay_1_c: {
                            label_long: 'Overlay 1c',
                            label_short: 'Overlay 1c',
                            minZoom: 8,
                            maxZoom: 16
                        }
                    }
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                store = _store_;
                ACTIONS = _ACTIONS_;
            }
        );

        spyOn(store, 'dispatch');
    });

    function getComponent (overlay, zoom) {
        var component,
            element,
            scope;

        element = document.createElement('dp-legend-item');
        element.setAttribute('overlay', 'overlay');
        element.setAttribute('zoom', 'zoom');

        scope = $rootScope.$new();
        scope.overlay = overlay;
        scope.zoom = zoom;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('Legend creation', function() {
        it('Creates a legend using label_short for title', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: true}, 8);
            expect(component.find('.legend-item__title').text()).toBe('Ov-1a');
        });
        it('Correctly creates legend if available', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: true}, 8);
            expect(component.find('.legend-item__legend').length).toBe(1);
            expect(component.find('.legend-item__legend img')[0].src).toContain('/legends/over1a');
        });
        it('Correctly handles external legend', function() {
            var component = getComponent({id: 'overlay_1_b', isVisible: true}, 8);
            expect(component.find('.legend-item__legend img')[0].src).toBe('http://external.local/legends/over1a');
        });
        it('does not creates legend if unavailable', function() {
            var component = getComponent({id: 'overlay_1_c', isVisible: true}, 8);
            expect(component.find('.legend-item__legend').length).toBe(0);
        });
    });
    describe('Changes visibility', function() {
        it('Changes visibility on click', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: true}, 8);
            component.find('.legend-item__toggle button').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                payload: 'overlay_1_a',
                type: ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY
            });
        });
    });
    describe('Show correct icon', function() {
        it('Shows visible icon when visible', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: true}, 8);
            expect(component.find('.legend-item__toggle img')[0].src.split('/').pop()).toBe('visible.svg');
        });
        it('Shows hidden icon when hidden', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: false}, 8);
            expect(component.find('.legend-item__toggle img')[0].src.split('/').pop()).toBe('invisible-hidden.svg');
        });
        it('Shows hidden by zoom icon when visible but on wrong zoom', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: true}, 4);
            expect(component.find('.legend-item__toggle img')[0].src.split('/').pop()).toBe('invisible-zoomlevel.svg');
        });
        it('Shows hidden icon even in wrong zoom', function() {
            var component = getComponent({id: 'overlay_1_a', isVisible: false}, 4);
            expect(component.find('.legend-item__toggle img')[0].src.split('/').pop()).toBe('invisible-hidden.svg');
        });
    });
});
