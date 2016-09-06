describe('The atlas statusbar component', function() {
	var $compile,
        store,
        ACTIONS,
        $rootScope;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.factory('dpLinkDirective', function () {
                    return {};
                });
                $provide.factory('dpLegendItemDirective', function () {
                    return {};
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

    function getComponent (overlays, zoom) {
        var component,
            element,
            scope;

        element = document.createElement('dp-overlay-legend');
        element.setAttribute('overlays', 'overlays');
        element.setAttribute('zoom', 'zoom');

        scope = $rootScope.$new();
        scope.overlays = overlays;
        scope.zoom = zoom;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }


    describe('overlay legend present', function() {
    	it('Has layers panel', function() {
    		var component = getComponent([], 8);
    		expect(component.find('.c-overlay-legend').length).toBe(1);
    	});
    	it('Can open the legend', function() {
    		var component = getComponent([{id: 'some_overlay', isVisible: true}], 8);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--hidden').length).toBe(1);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--shown').length).toBe(0);
    		component.find('.c-overlay-legend__header').click();
    		expect(component.find('.c-overlay-legend.c-overlay-legend--hidden').length).toBe(0);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--shown').length).toBe(1);
            expect(store.dispatch).not.toHaveBeenCalledWith({
                type: ACTIONS.SHOW_LAYER_SELECTION,
            });
    	});
    	it('Can close the legend', function() {
    		var component = getComponent([{id: 'some_overlay', isVisible: true}], 8);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--hidden').length).toBe(1);
    		expect(component.find('.c-overlay-legend.c-overlay-legend__showen').length).toBe(0);
    		component.find('.c-overlay-legend__header').click();
    		component.find('.c-overlay-legend__header').click();
    		expect(component.find('.c-overlay-legend.c-overlay-legend--hidden').length).toBe(1);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--shown').length).toBe(0);
    	});
        it('Opens layer selector when no layers are active', function() {
            var component = getComponent([], 8);
            component.find('.c-overlay-legend__header').click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SHOW_LAYER_SELECTION,
            });
        });
    });
    describe('Statusbar adds layer to legend', function() {
    	it('Starts closed', function() {
    		var component = getComponent([], 8);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--hidden').length).toBe(1);
    		expect(component.find('.c-overlay-legend.c-overlay-legend--shown').length).toBe(0);
    	});
    	it('Starts empty', function() {
    		var component = getComponent([], 8);
    		expect(component.find('dp-legend-item').length).toBe(0);
    	});
    	it('Correctly adds a new active layer', function() {
            var overlays = [],
                component = getComponent(overlays, 8);
           expect(component.find('dp-legend-item').length).toBe(0);
           overlays = [{id: 'some_overlay', isVisible: true}];
           component.isolateScope().vm.overlays = overlays;
           $rootScope.$apply();
           expect(component.find('dp-legend-item').length).toBe(1);
    	});
    	it ('Correctly removes a removed layer', function() {
            var overlays = [{id: 'some_overlay', isVisible: true}],
                component = getComponent(overlays, 8);
           expect(component.find('dp-legend-item').length).toBe(1);
           overlays = [];
           component.isolateScope().vm.overlays = overlays;
           $rootScope.$apply();
           expect(component.find('dp-legend-item').length).toBe(0);
    	});
    });
    describe('Statusbar layer counts', function() {
    	it ('Hides count with no layers active', function() {
            var overlays = [],
                component = getComponent(overlays, 8);
            expect(component.find('.qa-show-layers-count').length).toBe(0);
            overlays = [{id: 'some_overlay', isVisible: true}, {id: 'other_overlay', isVisible: true}];
            component.isolateScope().vm.overlays = overlays;
            $rootScope.$apply();
            expect(component.find('.qa-show-layers-count').length).toBe(1);
    	});
        it('Correctly count active layers', function() {
            var overlays = [{id: 'some_overlay', isVisible: true}, {id: 'other_overlay', isVisible: true}],
                layerCount,
                component = getComponent(overlays, 8);
                expect(component.find('.qa-show-active-layers-count').length).toBe(1);
                layerCount = component.find('.qa-show-active-layers-count')[0].innerText[0];
                expect(parseInt(layerCount, 10)).toBe(2);
        });
    	it('Hides active count when non are hidden', function() {
            var overlays = [{id: 'some_overlay', isVisible: true}, {id: 'other_overlay', isVisible: true}],
                component = getComponent(overlays, 8);
            expect(component.find('.qa-show-visible-layers-count').length).toBe(0);
            expect(component.find('.qa-show-active-layers-count').length).toBe(1);
    	});
        it('Correctly counts visible layers', function() {
            var overlays = [{id: 'some_overlay', isVisible: true}, {id: 'other_overlay', isVisible: false}],
                layerCount,
                component = getComponent(overlays, 8);
            expect(component.find('.qa-show-visible-layers-count').length).toBe(1);
            layerCount = component.find('.qa-show-visible-layers-count')[0].innerText[0];
                expect(parseInt(layerCount, 10)).toBe(1);
        });
    	it('Shows visible and active count when some layers are hidden', function() {
            var overlays = [{id: 'some_overlay', isVisible: true}, {id: 'other_overlay', isVisible: false}],
                component = getComponent(overlays, 8);
            expect(component.find('.qa-show-visible-layers-count').length).toBe(1);
            expect(component.find('.qa-show-active-layers-count').length).toBe(1);

    	});
    });
});