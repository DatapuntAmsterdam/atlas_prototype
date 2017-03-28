describe('The dp-layer-selection component', function () {
    var $compile,
        $rootScope,
        store,
        user,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'dpLayerSelection',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.constant('BASE_LAYERS', [
                    {
                        slug: 'base_layer_a',
                        label: 'Base layer A'
                    }, {
                        slug: 'base_layer_b',
                        label: 'Base layer B'
                    }
                ]);

                $provide.constant('OVERLAYS', {
                    SOURCES: {
                        overlay_1_a: {
                            label_short: 'Overlay 1a',
                            label_long: 'L_Overlay 1a',
                            minZoom: 8,
                            maxZoom: 16
                        },
                        overlay_1_b: {
                            label_short: 'Overlay 1b',
                            label_long: 'L_Overlay 1b',
                            minZoom: 8,
                            maxZoom: 16
                        },
                        overlay_2_a: {
                            label_short: 'Overlay 2a',
                            label_long: 'L_Overlay 2a',
                            minZoom: 8,
                            maxZoom: 10
                        },
                        overlay_2_b: {
                            label_short: 'Overlay 2b',
                            label_long: 'L_Overlay 2b',
                            minZoom: 11,
                            maxZoom: 14
                        },
                        overlay_2_c: {
                            label_short: 'Overlay 2c',
                            label_long: 'L_Overlay 2c',
                            minZoom: 15,
                            maxZoom: 16
                        }
                    },
                    HIERARCHY: [
                        {
                            heading: 'Category 1',
                            overlays: ['overlay_1_a', 'overlay_1_b']
                        }, {
                            heading: 'Category 2',
                            overlays: ['overlay_2_a', 'overlay_2_b', 'overlay_2_c']
                        }
                    ]
                });

                $provide.factory('dpPanelDirective', function () {
                    return {};
                });

                $provide.factory('dpPanelIconDirective', function () {
                    return {};
                });

                $provide.factory('dpPanelBodyDirective', function () {
                    return {};
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _user_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            user = _user_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent (baseLayer, overlays, zoom) {
        var component,
            element,
            scope;

        element = document.createElement('dp-layer-selection');
        element.setAttribute('base-layer', baseLayer);
        element.setAttribute('overlays', 'overlays');
        element.setAttribute('zoom', 'zoom');

        scope = $rootScope.$new();
        scope.overlays = overlays;
        scope.zoom = zoom;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('there is a close icon', function () {
        var component;

        beforeEach(function () {
            component = getComponent('base_layer_a', [], 8);
        });

        it('that triggers HIDE_LAYER_SELECTION', function () {
            component.find('.c-layer-selection__close').click();

            $rootScope.$apply();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.HIDE_LAYER_SELECTION
            });
        });

        it('with a title attribute and screen reader fallback', function () {
            expect(component.find('.c-layer-selection__heading button').attr('title')).toBe('Sluiten');
            expect(component.find('.c-layer-selection__heading button .u-sr-only').text()).toContain('Sluiten');
        });
    });

    describe('base layer', function () {
        it('lists all base layers as radio buttons w/ labels', function () {
            var component = getComponent('base_layer_a', [], 8);

            expect(component.find('ul').eq(0).find('li').length).toBe(2);
            expect(component.find('ul').eq(0).find('li').eq(0).find('label').text().trim()).toBe('Base layer A');
            expect(component.find('ul').eq(0).find('li').eq(0).find('input').attr('type')).toBe('radio');
            expect(component.find('ul').eq(0).find('li').eq(0).find('input').val()).toBe('base_layer_a');

            expect(component.find('ul').eq(0).find('li').eq(1).find('label').text().trim()).toBe('Base layer B');
            expect(component.find('ul').eq(0).find('li').eq(1).find('input').attr('type')).toBe('radio');
            expect(component.find('ul').eq(0).find('li').eq(1).find('input').val()).toBe('base_layer_b');
        });

        it('can set the base layer', function () {
            var component = getComponent('base_layer_a', [], 8),
                scope = component.isolateScope();

            // Choose another base layer
            scope.vm.setBaseLayer('base_layer_b');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_BASELAYER,
                payload: 'base_layer_b'
            });

            // Put the default base layer back
            scope.vm.setBaseLayer('base_layer_a');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_BASELAYER,
                payload: 'base_layer_a'
            });
        });
    });

    describe('overlays', function () {
        it('lists all overlays as checkboxes w/ labels', function () {
            var component = getComponent('base_layer_a', [], 8),
                contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(1).find('h2').text()).toBe('Category 1');

            expect(contentDiv.find('div').eq(1).find('li').eq(0).find('label').text().trim()).toBe('L_Overlay 1a');
            expect(contentDiv.find('div').eq(1).find('li').eq(0).find('input').attr('type')).toBe('checkbox');
            expect(contentDiv.find('div').eq(1).find('li').eq(0).find('input').val()).toBe('overlay_1_a');

            expect(contentDiv.find('div').eq(1).find('li').eq(1).find('label').text().trim()).toBe('L_Overlay 1b');
            expect(contentDiv.find('div').eq(1).find('li').eq(1).find('input').attr('type')).toBe('checkbox');
            expect(contentDiv.find('div').eq(1).find('li').eq(1).find('input').val()).toBe('overlay_1_b');

            expect(contentDiv.find('div').eq(2).find('h2').text()).toBe('Category 2');

            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('label').text().trim()).toBe('L_Overlay 2a');
            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('input').attr('type')).toBe('checkbox');
            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('input').val()).toBe('overlay_2_a');

            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('label').text().trim()).toBe('L_Overlay 2b');
            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('input').attr('type')).toBe('checkbox');
            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('input').val()).toBe('overlay_2_b');

            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('label').text().trim()).toBe('L_Overlay 2c');
            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('input').attr('type')).toBe('checkbox');
            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('input').val()).toBe('overlay_2_c');
        });

        it('marks the checkboxes for active overlays', function () {
            var component,
                contentDiv;

            // Nothing is checked if there are no overlays
            component = getComponent('base_layer_a', [], 8);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(1).find('li').eq(0).find('input').attr('checked')).toBeUndefined();
            expect(contentDiv.find('div').eq(1).find('li').eq(1).find('input').attr('checked')).toBeUndefined();
            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('input').attr('checked')).toBeUndefined();
            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('input').attr('checked')).toBeUndefined();
            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('input').attr('checked')).toBeUndefined();

            // With active overlays
            component = getComponent('base_layer_a',
                [{id: 'overlay_1_a', isVisible: true}, {id: 'overlay_2_b', isVisible: true}], 8);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(1).find('li').eq(0).find('input').attr('checked')).toBe('checked');
            expect(contentDiv.find('div').eq(1).find('li').eq(1).find('input').attr('checked')).toBeUndefined();
            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('input').attr('checked')).toBeUndefined();
            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('input').attr('checked')).toBe('checked');
            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('input').attr('checked')).toBeUndefined();
        });

        it('can toggle overlays', function () {
            var component = getComponent('base_layer_a', [{id: 'overlay_1_a', isVisible: true}], 8),
                scope = component.isolateScope();

            // Add one
            scope.vm.toggleOverlay('overlay_1_b');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ADD_OVERLAY,
                payload: 'overlay_1_b'
            });

            // Remove one
            scope.vm.toggleOverlay('overlay_1_a');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_REMOVE_OVERLAY,
                payload: 'overlay_1_a'
            });
        });

        it('has a indicator for overlays not visible on this zoom level', function () {
            var component,
                contentDiv,
                allOverlays,
                zoom,
                expectedZoomIndicatorText;

            allOverlays = [
                {id: 'overlay_1_a', isVisible: true},
                {id: 'overlay_1_b', isVisible: true},
                {id: 'overlay_2_a', isVisible: true},
                {id: 'overlay_2_b', isVisible: true},
                {id: 'overlay_2_c', isVisible: true}
            ];

            expectedZoomIndicatorText = 'Zichtbaar bij verder zoomen';

            for (zoom = 8; zoom <= 10; zoom++) {
                component = getComponent('base_layer_a', allOverlays, zoom);
                contentDiv = component.find('.c-layer-selection__content');

                // overlay_1_a
                expect(contentDiv.find('div').eq(1).find('li').eq(0).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_1_b
                expect(contentDiv.find('div').eq(1).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_2_a
                expect(contentDiv.find('div').eq(2).find('li').eq(0).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_2_b
                expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(1);
                expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').text())
                    .toContain(expectedZoomIndicatorText);

                // overlay_2_c
                expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').length).toBe(1);
                expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').text())
                    .toContain(expectedZoomIndicatorText);
            }

            for (zoom = 11; zoom <= 14; zoom++) {
                component = getComponent('base_layer_a', allOverlays, zoom);
                contentDiv = component.find('.c-layer-selection__content');

                // overlay_1_a
                expect(contentDiv.find('div').eq(1).find('li').eq(0).find('.qa-show-invisble-by-zoom').length);

                // overlay_1_b
                expect(contentDiv.find('div').eq(1).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_2_a
                expect(contentDiv.find('div').eq(2).find('li').eq(0).find('.qa-show-invisble-by-zoom').length).toBe(1);
                expect(contentDiv.find('div').eq(2).find('li').eq(0).find('.qa-show-invisble-by-zoom').text())
                    .toContain(expectedZoomIndicatorText);

                // overlay_2_b
                expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_2_c
                expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').length).toBe(1);
                expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').text())
                    .toContain(expectedZoomIndicatorText);
            }

            for (zoom = 15; zoom <= 16; zoom++) {
                component = getComponent('base_layer_a', allOverlays, zoom);
                contentDiv = component.find('.c-layer-selection__content');

                // overlay_1_a
                expect(contentDiv.find('div').eq(1).find('li').eq(0).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_1_b
                expect(contentDiv.find('div').eq(1).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(0);

                // overlay_2_a
                expect(contentDiv.find('div').eq(2).find('li').eq(0).find('.qa-show-invisble-by-zoom').length).toBe(1);
                expect(contentDiv.find('div').eq(2).find('li').eq(0).find('.qa-show-invisble-by-zoom').text())
                    .toContain(expectedZoomIndicatorText);

                // overlay_2_b
                expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(1);
                expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').text())
                    .toContain(expectedZoomIndicatorText);

                // overlay_2_c
                expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').length).toBe(0);
            }
        });

        it('makes the active overlays bold (regardless of zoom level)', function () {
            var component,
                contentDiv;

            // Active and visible
            component = getComponent('base_layer_a', [{id: 'overlay_2_a', isVisible: true}], 8);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('strong').text()).toContain('Overlay 2a');

            // Active and invisible
            component = getComponent('base_layer_a', [{id: 'overlay_2_a', isVisible: true}], 16);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('strong').text()).toContain('Overlay 2a');

            // Non-active (still using strong)
            component = getComponent('base_layer_a', [], 16);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('strong').length).toBe(0);
            expect(contentDiv.find('div').eq(2).find('li').eq(0).find('span').text()).toContain('Overlay 2a');
        });

        it('only shows the i-am-not-visible indicator for active overlays', function () {
            var component,
                contentDiv;

            // When the overlays are active
            component = getComponent('base_layer_a',
                [{id: 'overlay_2_b', isVisible: true}, {id: 'overlay_2_c', isVisible: true}], 8);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(1);
            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').length).toBe(1);

            // When the overlays are not active
            component = getComponent('base_layer_a', [], 8);
            contentDiv = component.find('.c-layer-selection__content');

            expect(contentDiv.find('div').eq(2).find('li').eq(1).find('.qa-show-invisble-by-zoom').length).toBe(0);
            expect(contentDiv.find('div').eq(2).find('li').eq(2).find('.qa-show-invisble-by-zoom').length).toBe(0);
        });

        describe('the warning message', () => {
            beforeEach(() => {
                spyOn(user, 'getUserType').and.returnValue(user.USER_TYPE.NONE);
                spyOn(user, 'meetsRequiredLevel').and.returnValue(false);
            });
            it('is shown if not logged in', () => {
                const component = getComponent('base_layer_a', [], 8);

                expect(component.find('.qa-category-warning').text())
                    .toContain('\'Bedrijven - Bronnen en risicozones\' verschijnt na _inloggen_');
            });
            it('is shown for a non-employee', () => {
                user.getUserType.and.returnValue(user.USER_TYPE.AUTHENTICATED);

                const component = getComponent('base_layer_a', [], 8);

                expect(component.find('.qa-category-warning').length).toBe(1);
            });
            it('is not shown for an employee', () => {
                user.getUserType.and.returnValue(user.USER_TYPE.AUTHENTICATED);
                user.meetsRequiredLevel.and.returnValue(true);

                const component = getComponent('base_layer_a', [], 8);

                expect(component.find('.qa-category-warning').length).toBe(0);
            });
            it('should update the message on authorization change', function () {
                const component = getComponent('base_layer_a', [], 8);
                expect(component.find('.qa-category-warning').length).toBe(1);

                spyOn(user, 'getAuthorizationLevel').and.returnValue('foo'); // changed so $watch fires
                user.getUserType.and.returnValue(user.USER_TYPE.AUTHENTICATED);
                user.meetsRequiredLevel.and.returnValue(true);
                $rootScope.$apply();

                expect(component.find('.qa-category-warning').length).toBe(0);
            });
        });
    });
});
