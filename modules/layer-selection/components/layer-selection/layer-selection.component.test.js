describe('The atlas-layer-selection component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module(
            'atlasLayerSelection',
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
                            label_long: 'Overlay 1a',
                            minZoom: 8,
                            maxZoom: 16
                        },
                        overlay_1_b: {
                            label_long: 'Overlay 1b',
                            minZoom: 8,
                            maxZoom: 16
                        },
                        overlay_2_a: {
                            label_long: 'Overlay 2a',
                            minZoom: 8,
                            maxZoom: 10
                        },
                        overlay_2_b: {
                            label_long: 'Overlay 2b',
                            minZoom: 11,
                            maxZoom: 14
                        },
                        overlay_2_c: {
                            label_long: 'Overlay 2c',
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

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn(store, 'dispatch');
    });

    function getComponent (baseLayer, overlays, zoom) {
        var component,
            element,
            scope;

        element = document.createElement('atlas-layer-selection');
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

            //Choose another base layer
            scope.vm.setBaseLayer('base_layer_b');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_BASELAYER,
                payload: 'base_layer_b'
            });

            //Put the default base layer back
            scope.vm.setBaseLayer('base_layer_a');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_SET_BASELAYER,
                payload: 'base_layer_a'
            });
        });
    });

    describe('overlays', function () {
        it('lists all overlays as checkboxes w/ labels', function () {
            var component = getComponent('base_layer_a', [], 8);

            expect(component.find('div').eq(1).find('h2').text()).toBe('Category 1');
            expect(component.find('div').eq(1).find('li').eq(0).find('label').text().trim()).toBe('Overlay 1a');
            expect(component.find('div').eq(1).find('li').eq(0).find('input').attr('type')).toBe('checkbox');
            expect(component.find('div').eq(1).find('li').eq(0).find('input').val()).toBe('overlay_1_a');

            expect(component.find('div').eq(1).find('li').eq(1).find('label').text().trim()).toBe('Overlay 1b');
            expect(component.find('div').eq(1).find('li').eq(1).find('input').attr('type')).toBe('checkbox');
            expect(component.find('div').eq(1).find('li').eq(1).find('input').val()).toBe('overlay_1_b');


            expect(component.find('div').eq(2).find('h2').text()).toBe('Category 2');
            expect(component.find('div').eq(2).find('li').eq(0).find('label').text().trim()).toBe('Overlay 2a');
            expect(component.find('div').eq(2).find('li').eq(0).find('input').attr('type')).toBe('checkbox');
            expect(component.find('div').eq(2).find('li').eq(0).find('input').val()).toBe('overlay_2_a');

            expect(component.find('div').eq(2).find('li').eq(1).find('label').text().trim()).toBe('Overlay 2b');
            expect(component.find('div').eq(2).find('li').eq(1).find('input').attr('type')).toBe('checkbox');
            expect(component.find('div').eq(2).find('li').eq(1).find('input').val()).toBe('overlay_2_b');

            expect(component.find('div').eq(2).find('li').eq(2).find('label').text().trim()).toBe('Overlay 2c');
            expect(component.find('div').eq(2).find('li').eq(2).find('input').attr('type')).toBe('checkbox');
            expect(component.find('div').eq(2).find('li').eq(2).find('input').val()).toBe('overlay_2_c');
        });

        it('marks the checkboxes for active overlays', function () {
            var component;

            //Nothing is checked if there are no overlays
            component = getComponent('base_layer_a', [], 8);

            expect(component.find('div').eq(1).find('li').eq(0).find('input').attr('checked')).toBeUndefined();
            expect(component.find('div').eq(1).find('li').eq(1).find('input').attr('checked')).toBeUndefined();
            expect(component.find('div').eq(2).find('li').eq(0).find('input').attr('checked')).toBeUndefined();
            expect(component.find('div').eq(2).find('li').eq(1).find('input').attr('checked')).toBeUndefined();
            expect(component.find('div').eq(2).find('li').eq(2).find('input').attr('checked')).toBeUndefined();

            //With active overlays
            component = getComponent('base_layer_a', ['overlay_1_a', 'overlay_2_b'], 8);

            expect(component.find('div').eq(1).find('li').eq(0).find('input').attr('checked')).toBe('checked');
            expect(component.find('div').eq(1).find('li').eq(1).find('input').attr('checked')).toBeUndefined();
            expect(component.find('div').eq(2).find('li').eq(0).find('input').attr('checked')).toBeUndefined();
            expect(component.find('div').eq(2).find('li').eq(1).find('input').attr('checked')).toBe('checked');
            expect(component.find('div').eq(2).find('li').eq(2).find('input').attr('checked')).toBeUndefined();
        });

        it('can toggle overlays', function () {
            var component = getComponent('base_layer_a', ['overlay_1_a'], 8),
                scope = component.isolateScope();

            //Add one
            scope.vm.toggleOverlay('overlay_1_b');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_ADD_OVERLAY,
                payload: 'overlay_1_b'
            });

            //Remove one
            scope.vm.toggleOverlay('overlay_1_a');

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.MAP_REMOVE_OVERLAY,
                payload: 'overlay_1_a'
            });
        });

        it('has a indicator for overlays not visible on this zoom level', function () {
            var component,
                allOverlays,
                zoom,
                expectedZoomIndicatorText;

            allOverlays = [
                'overlay_1_a',
                'overlay_1_b',
                'overlay_2_a',
                'overlay_2_b',
                'overlay_2_c'
            ];

            expectedZoomIndicatorText = '(deze kaartlaag is niet zichtbaar op dit zoomniveau)';

            for (zoom = 8; zoom <= 10; zoom++) {
                component = getComponent('base_layer_a', allOverlays, zoom);

                //overlay_1_a
                expect(component.find('div').eq(1).find('li').eq(0).find('span').length).toBe(0);

                //overlay_1_b
                expect(component.find('div').eq(1).find('li').eq(1).find('span').length).toBe(0);

                //overlay_2_a
                expect(component.find('div').eq(2).find('li').eq(0).find('span').length).toBe(0);

                //overlay_2_b
                expect(component.find('div').eq(2).find('li').eq(1).find('span').length).toBe(1);
                expect(component.find('div').eq(2).find('li').eq(1).find('span').text().trim())
                    .toBe(expectedZoomIndicatorText);

                //overlay_2_c
                expect(component.find('div').eq(2).find('li').eq(2).find('span').length).toBe(1);
                expect(component.find('div').eq(2).find('li').eq(2).find('span').text().trim())
                    .toBe(expectedZoomIndicatorText);
            }

            for (zoom = 11; zoom <= 14; zoom++) {
                component = getComponent('base_layer_a', allOverlays, zoom);

                //overlay_1_a
                expect(component.find('div').eq(1).find('li').eq(0).find('span').length).toBe(0);

                //overlay_1_b
                expect(component.find('div').eq(1).find('li').eq(1).find('span').length).toBe(0);

                //overlay_2_a
                expect(component.find('div').eq(2).find('li').eq(0).find('span').length).toBe(1);
                expect(component.find('div').eq(2).find('li').eq(0).find('span').text().trim())
                    .toBe(expectedZoomIndicatorText);

                //overlay_2_b
                expect(component.find('div').eq(2).find('li').eq(1).find('span').length).toBe(0);

                //overlay_2_c
                expect(component.find('div').eq(2).find('li').eq(2).find('span').length).toBe(1);
                expect(component.find('div').eq(2).find('li').eq(2).find('span').text().trim())
                    .toBe(expectedZoomIndicatorText);
            }

            for (zoom = 15; zoom <= 16; zoom++) {
                component = getComponent('base_layer_a', allOverlays, zoom);

                //overlay_1_a
                expect(component.find('div').eq(1).find('li').eq(0).find('span').length).toBe(0);

                //overlay_1_b
                expect(component.find('div').eq(1).find('li').eq(1).find('span').length).toBe(0);

                //overlay_2_a
                expect(component.find('div').eq(2).find('li').eq(0).find('span').length).toBe(1);
                expect(component.find('div').eq(2).find('li').eq(0).find('span').text().trim())
                    .toBe(expectedZoomIndicatorText);

                //overlay_2_b
                expect(component.find('div').eq(2).find('li').eq(1).find('span').length).toBe(1);
                expect(component.find('div').eq(2).find('li').eq(1).find('span').text().trim())
                    .toBe(expectedZoomIndicatorText);

                //overlay_2_c
                expect(component.find('div').eq(2).find('li').eq(2).find('span').length).toBe(0);
            }
        });

        it('makes the active overlays bold (regardless of zoom level)', function () {
            var component;

            //Active and visible
            component = getComponent('base_layer_a', ['overlay_2_a'], 8);
            expect(component.find('div').eq(2).find('li').eq(0).find('strong').text()).toContain('Overlay 2a');

            //Active and invisible
            component = getComponent('base_layer_a', ['overlay_2_a'], 16);
            expect(component.find('div').eq(2).find('li').eq(0).find('strong').text()).toContain('Overlay 2a');

            //Non-active (still using strong)
            component = getComponent('base_layer_a', [], 16);
            expect(component.find('div').eq(2).find('li').eq(0).find('strong').length).toBe(0);
            expect(component.find('div').eq(2).find('li').eq(0).find('span').text()).toContain('Overlay 2a');
        });

        it('only shows the i-am-not-visible indicator for active overlays', function () {
            var component;

            //When the overlays are active
            component = getComponent('base_layer_a', ['overlay_2_b', 'overlay_2_c'], 8);

            //overlay_2_b
            expect(component.find('div').eq(2).find('li').eq(1).text())
                .toContain('(deze kaartlaag is niet zichtbaar op dit zoomniveau)');

            //overlay_2_c
            expect(component.find('div').eq(2).find('li').eq(2).text())
                .toContain('(deze kaartlaag is niet zichtbaar op dit zoomniveau)');



            //When the overlays are not active
            component = getComponent('base_layer_a', [], 8);

            //overlay_2_b
            expect(component.find('div').eq(2).find('li').eq(1).text())
                .not.toContain('(deze kaartlaag is niet zichtbaar op dit zoomniveau)');

            //overlay_2_c
            expect(component.find('div').eq(2).find('li').eq(2).text())
                .not.toContain('(deze kaartlaag is niet zichtbaar op dit zoomniveau)');
        });
    });
});