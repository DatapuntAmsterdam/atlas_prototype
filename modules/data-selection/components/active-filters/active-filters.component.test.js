describe('The dp-data-selection-filters component', function () {
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

    function getComponent (activeFilters) {
        var component,
            element,
            scope;

        element = document.createElement('dp-data-selection-active-filters');

        element.setAttribute('dataset', 'my_special_dataset');
        element.setAttribute('available-filters', 'availableFilters');
        element.setAttribute('active-filters', 'activeFilters');

        scope = $rootScope.$new();
        scope.availableFilters = availableFilters;
        scope.activeFilters = activeFilters;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows a list of all active filters', function () {
        var component,
            activeFilters;

        // Without any active filters
        activeFilters = {};
        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(0);

        // With active filters
        activeFilters = {
            filterb: 'optie-b-3',
            filter_a_new: 'optie-a-7'
        };

        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(1);

        // The configured order is respected here
        expect(component.find('.qa-active-filters li').length).toBe(2);
        expect(component.find('.qa-active-filters li').eq(0).text()).toContain('Optie A-7');
        expect(component.find('.qa-active-filters li').eq(1).text()).toContain('Optie B-3');
    });

    it('shows an empty list with no available filters', function () {
        var component,
            activeFilters;

        availableFilters = null;

        // Without any active filters
        activeFilters = {};
        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(0);

        // With active filters
        activeFilters = {
            filterb: 'optie-b-3',
            filter_a_new: 'optie-a-7'
        };

        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(0);
    });

    it('active filters can be removed, dispatching an action', function () {
        var component,
            activeFilters;

        // Without any active filters
        activeFilters = {
            filter_a_new: 'optie-a-2',
            filterb: 'optie-b-2'
        };

        component = getComponent(activeFilters);

        // Remove 'Optie B2' (filterb)
        component.find('.qa-active-filters li').eq(1).find('button').click();

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
});
