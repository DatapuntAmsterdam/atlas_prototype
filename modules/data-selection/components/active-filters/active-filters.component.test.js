describe('The dp-data-selection-active-filters component', () => {
    let $compile,
        $rootScope,
        store,
        ACTIONS,
        availableFilters,
        geometryFilter;

    beforeEach(() => {
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

        geometryFilter = {
            markers: [],
            description: 'description'
        };

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
            }, {
                slug: 'sbi_code',
                label: 'SBI-code',
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
        const element = document.createElement('dp-data-selection-active-filters');

        element.setAttribute('dataset', 'my_special_dataset');
        element.setAttribute('available-filters', 'availableFilters');
        element.setAttribute('text-filters', 'textFilters');
        element.setAttribute('geometry-filter', 'geometryFilter');

        const scope = $rootScope.$new();
        scope.availableFilters = availableFilters;
        scope.textFilters = activeFilters;
        scope.geometryFilter = geometryFilter;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('shows a list of all active filters', () => {
        let component,
            activeFilters;
        // Without any active filters
        activeFilters = {};
        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(0);

        // With active filters
        activeFilters = {
            filterb: 'optie-b-3',
            filter_a_new: 'optie-a-7',
            sbi_code: '[\'10\']'
        };

        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(1);

        // The configured order is respected here
        expect(component.find('.qa-active-filters li').length).toBe(3);
        expect(component.find('.qa-active-filters li').eq(0).text()).toContain('Optie A-7');
        expect(component.find('.qa-active-filters li').eq(1).text()).toContain('Optie B-3');
        expect(component.find('.qa-active-filters li').eq(2).text()).toContain('10');
        expect(component.find('.qa-active-filters li').eq(2).text()).not.toContain('\'10\'');
        expect(component.find('.qa-active-filters li').eq(2).text()).not.toContain('[\'10\']');
    });

    it('shows the geometry filter when one is defined', () => {
        // Without any active filters, but with a geometry filter
        const activeFilters = {};
        geometryFilter = {
            markers: [1, 2, 3],
            description: 'description'
        };

        const component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').text()).toContain('Locatie:');
        expect(component.find('.qa-active-filters').text()).toContain('ingetekend (description)');
    });

    it('shows an empty list with no available filters', () => {
        let activeFilters,
            component;

        availableFilters = null;

        // Without any active filters
        activeFilters = {};
        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(0);

        // With active filters
        activeFilters = {
            filterb: 'optie-b-3',
            filter_a_new: 'optie-a-7',
            sbi_code: '[\'10\']'
        };

        component = getComponent(activeFilters);
        expect(component.find('.qa-active-filters').length).toBe(0);
    });

    it('active filters can be removed, dispatching an action', () => {
        // Without any active filters
        const activeFilters = {
            filter_a_new: 'optie-a-2',
            filterb: 'optie-b-2'
        };

        const component = getComponent(activeFilters);

        // Remove 'Optie B2' (filterb)
        component.find('.qa-active-filters li').eq(1).find('button').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.APPLY_FILTERS,
            payload: {
                filter_a_new: 'optie-a-2'
            }
        });
    });

    it('a geometry filters can be removed, dispatching an action', () => {
        // Without any active filters, but with a geometry filter
        const activeFilters = {};
        geometryFilter = {
            markers: [1, 2, 3],
            description: 'description'
        };

        const component = getComponent(activeFilters);

        component.find('.qa-active-filters li').eq(0).find('button').click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_DATA_SELECTION,
            payload: {
                dataset: 'my_special_dataset',
                resetGeometryFilter: true,
                page: 1
            }
        });
    });

    it('shows active filters correctly when filter has no options', () => {
        const activeFilters = {
            filter_a_new: 'optie-a-7'
        };
        availableFilters[0].options = [];
        availableFilters[0].numberOfOptions = 0;

        const component = getComponent(activeFilters);

        expect(component.find('.qa-active-filters').length).toBe(1);
        expect(component.find('.qa-active-filters li').eq(0).text()).toContain('optie-a-7');
    });
});
