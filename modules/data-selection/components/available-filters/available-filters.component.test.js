describe('The dp-data-selection-available-filters component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS,
        availableFilters;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                store: {
                    dispatch: function () {}
                }
            },
            function ($provide) {
                $provide.constant('DATA_SELECTION_CONFIG', {
                    datasets: {
                        my_special_dataset: {
                            FILTERS: [
                                {
                                    slug: 'filter_a_new'
                                }, {
                                    slug: 'filterb'
                                }
                            ]
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
        });

        availableFilters = [
            {
                slug: 'filter_a_new',
                label: 'Filter A',
                options: [
                    {
                        count: 11,
                        label: 'Optie A-1',
                        id: 'optie-a-1'
                    }, {
                        count: 18,
                        label: 'Optie A-2',
                        id: 'optie-a-2'
                    }, {
                        count: 13,
                        label: 'Optie A-3',
                        id: 'optie-a-3'
                    }, {
                        count: 14,
                        label: 'Optie A-4',
                        id: 'optie-a-4'
                    }, {
                        count: 15,
                        label: 'Optie A-5',
                        id: 'optie-a-5'
                    }, {
                        count: 16,
                        label: 'Optie A-6',
                        id: 'optie-a-6'
                    }, {
                        count: 17,
                        label: 'Optie A-7',
                        id: 'optie-a-7'
                    }, {
                        count: 18,
                        label: 'Optie A-8',
                        id: 'optie-a-8'
                    }, {
                        count: 19,
                        label: 'Optie A-9',
                        id: 'optie-a-9'
                    }, {
                        count: 20,
                        label: 'Optie A-10',
                        id: 'optie-a-10'
                    }
                ],
                numberOfOptions: 10
            }, {
                slug: 'filterb',
                label: 'Filter B',
                options: [
                    {
                        count: 4,
                        label: 'Optie B-1',
                        id: 'optie-b-1'
                    }, {
                        count: 5,
                        label: 'Optie B-2',
                        id: 'optie-b-2'
                    }, {
                        count: 6,
                        label: 'Optie B-3',
                        id: 'optie-b-3'
                    }
                ],
                numberOfOptions: 3
            }
        ];

        spyOn(store, 'dispatch');
    });

    function getComponent (activeFilters, isLoading) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-available-filters');

        element.setAttribute('dataset', 'my_special_dataset');
        element.setAttribute('available-filters', 'availableFilters');
        element.setAttribute('active-filters', 'activeFilters');
        element.setAttribute('is-loading', 'isLoading');

        scope = $rootScope.$new();
        scope.availableFilters = availableFilters;
        scope.activeFilters = activeFilters;
        scope.isLoading = isLoading;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows a list of available filters', function () {
        var component = getComponent({}, false);

        expect(component.find('.qa-available-filters').length).toBe(1);
        expect(component.find('.qa-available-filters h2').text()).toBe('');

        // The first filter
        expect(component.find('.qa-available-filters h3').eq(0).text()).toBe('Filter A');
        expect(component.find('.qa-available-filters ul').eq(0).find('li').length).toBe(10);

        expect(component.find('.qa-available-filters ul').eq(0).find('li button').eq(0).text()).toContain('Optie A-1');
        expect(component.find('.qa-available-filters ul').eq(0).find('li').eq(0).text()).not.toContain('(11)');

        expect(component.find('.qa-available-filters ul').eq(0).find('li button').eq(9).text()).toContain('Optie A-10');
        expect(component.find('.qa-available-filters ul').eq(0).find('li').eq(9).text()).not.toContain('(20)');

        // The second filter
        expect(component.find('.qa-available-filters h3').eq(1).text()).toBe('Filter B');
        expect(component.find('.qa-available-filters ul').eq(1).find('li').length).toBe(3);

        expect(component.find('.qa-available-filters ul').eq(1).find('li button').eq(0).text()).toContain('Optie B-1');
        expect(component.find('.qa-available-filters ul').eq(1).find('li').eq(0).text()).not.toContain('(4)');

        expect(component.find('.qa-available-filters ul').eq(1).find('li button').eq(2).text()).toContain('Optie B-3');
        expect(component.find('.qa-available-filters ul').eq(1).find('li').eq(2).text()).not.toContain('(6)');
    });

    describe('it dispatches an action when a filter has been added', function () {
        it('when adding the first filter; one filter is communicated', function () {
            var component,
                activeFilters = {};

            component = getComponent(activeFilters, false);
            component.find('ul').eq(0).find('li').eq(1).find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: 'my_special_dataset',
                    filters: {
                        filter_a_new: 'optie-a-2'
                    },
                    page: 1
                }
            });
        });

        it('when adding another filter; all filters are communicated', function () {
            var component,
                activeFilters = {
                    filter_a_new: 'optie-a-2'
                };

            component = getComponent(activeFilters, false);
            component.find('.qa-available-filters ul').eq(1).find('li').eq(0).find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: 'my_special_dataset',
                    filters: {
                        filter_a_new: 'optie-a-2',
                        filterb: 'optie-b-1'
                    },
                    page: 1
                }
            });
        });

        it('can only have one option per filter', function () {
            var component,
                activeFilters = {
                    filter_a_new: 'optie-a-2',
                    filterb: 'optie-b-1'
                };

            component = getComponent(activeFilters, false);
            component.find('.qa-available-filters ul').eq(1).find('li').eq(1).find('button').click();

            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: 'my_special_dataset',
                    filters: {
                        filter_a_new: 'optie-a-2',
                        // filterb: 'Optie B-1' is no longer active now
                        filterb: 'optie-b-2'
                    },
                    page: 1
                }
            });
        });
    });

    it('uses different styling for active filters in the list w/ all filters', function () {
        var component,
            activeFilters;

        // Without any active filters
        activeFilters = {
            filterb: 'optie-b-2'
        };

        component = getComponent(activeFilters, false);

        // Regular styling for 'Optie B-1' & 'Optie B-3'
        expect(component.find('.qa-available-filters ul').eq(1).find('li').eq(0).find('button').attr('class'))
            .not.toContain('u-color__primary--dark');

        expect(component.find('.qa-available-filters ul').eq(1).find('li').eq(2).find('button').attr('class'))
            .not.toContain('u-color__primary--dark');

        // Custom styling for 'Optie B-2'
        expect(component.find('.qa-available-filters ul').eq(1).find('li').eq(1).find('button').attr('class'))
            .toContain('u-color__primary--dark');
    });

    it('updates its active filters when available filters are changed', function () {
        var component,
            activeFilters;

        activeFilters = 'aap';
        component = getComponent(activeFilters, false);
        component.scope().activeFilters = 'noot';
        component.scope().availableFilters = null;
        component.scope().$apply();

        expect(component.scope().formattedActiveFilters).toBeUndefined();
    });

    it('can implode both known and unknown filters', function () {
        var component = getComponent({}, false);
        var scope = component.isolateScope();

        scope.vm.expandFilter('xyz');
        scope.vm.implodeFilter('xyz');
        expect(scope.vm.isExpandedFilter('xyz')).toBe(false);

        scope.vm.implodeFilter('abc');
        expect(scope.vm.isExpandedFilter('abc')).toBe(false);
    });

    it('shows maximum of 10 options per filter, it can expand/implode when it has more than 10 results', function () {
        var component;

        // When there are 10 or less available options
        component = getComponent({}, false);
        expect(component.find('.qa-available-filters > div').eq(0).find('li').length).toBe(10);
        expect(component.find('.qa-available-filters > div').eq(0).find('button').length).toBe(10);
        expect(component.text()).not.toContain('Toon meer');

        // When there are more than 10 options
        availableFilters[0].options.push({
            count: 117,
            label: 'Optie A-11'
        });

        availableFilters[0].options.push({
            count: 104,
            label: 'Optie A-12'
        });

        availableFilters[0].numberOfOptions = 12;

        component = getComponent({}, false);
        expect(component.find('.qa-available-filters > div').eq(0).find('li').length).toBe(10);
        expect(component.find('.qa-available-filters > div').eq(0).find('button').length).toBe(11);
        expect(component.find('.qa-available-filters > div').eq(0).find('button').eq(10).text()).toContain('Toon meer');

        // Click the show more button
        component.find('.qa-available-filters > div').eq(0).find('button').click();
        $rootScope.$apply();

        expect(component.find('.qa-available-filters > div').eq(0).find('li').length).toBe(12);
        expect(component.find('.qa-available-filters > div').eq(0).find('li button').eq(10).text())
            .toContain('Optie A-11');
        expect(component.find('.qa-available-filters > div').eq(0).find('li button').eq(11).text())
            .toContain('Optie A-12');

        // Make sure the show more button is gone now
        expect(component.find('.qa-available-filters > div').eq(0).text()).not.toContain('Toon meer');
        // Make sure the show less button is shown
        expect(component.find('.qa-available-filters > div').eq(0).text()).toContain('Toon minder');

        // Click the show less button
        component.find('.qa-available-filters > div').eq(0).find('button').click();
        $rootScope.$apply();

        // Make sure the show less button is gone now
        expect(component.find('.qa-available-filters > div').eq(0).text()).not.toContain('Toon minder');
        // Make sure the show more button is shown
        expect(component.find('.qa-available-filters > div').eq(0).text()).toContain('Toon meer');
    });

    it('expanded filters have a message when there are more options that 100', function () {
        // When there are less than 100 options
        var component;

        // Making sure the mocked filter has more than 10 options
        availableFilters[0].options.push({
            count: 4,
            label: 'Optie A-11'
        });

        // When there are 100 or less available options
        component = getComponent({}, false);
        expect(component.find('.qa-available-filters > div').eq(0).find('.qa-hidden-options').length).toBe(0);
        component.find('.qa-available-filters > div').eq(0).find('.qa-show-more-button').click();
        expect(component.find('.qa-available-filters > div').eq(0).find('.qa-hidden-options').length).toBe(0);

        // When there are more then 100 available options: show the message after expanding the filter
        availableFilters[0].numberOfOptions = 101;
        component = getComponent({}, false);
        expect(component.find('.qa-available-filters > div').eq(0).find('.qa-hidden-options').length).toBe(0);
        component.find('.qa-available-filters > div').eq(0).find('.qa-show-more-button').click();
        expect(component.find('.qa-available-filters > div').eq(0).find('.qa-hidden-options').length).toBe(1);
    });
});
