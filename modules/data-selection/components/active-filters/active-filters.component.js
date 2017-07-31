((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionActiveFilters', {
            bindings: {
                dataset: '@',
                availableFilters: '=',
                textFilters: '=',
                geometryFilter: '<'
            },
            templateUrl: 'modules/data-selection/components/active-filters/active-filters.html',
            controller: DpDataSelectionActiveFilterController,
            controllerAs: 'vm'
        });

    DpDataSelectionActiveFilterController.$inject = ['$scope', 'store', 'ACTIONS'];

    function DpDataSelectionActiveFilterController ($scope, store, ACTIONS) {
        var vm = this;

        const GEOMETRY_FILTER = 'GEOMETRY_FILTER';  // Identification for a geometry filter

        $scope.$watchGroup(['vm.dataset', 'vm.textFilters'], updateFilters, true);

        vm.removeFilter = filterSlug => {
            if (filterSlug === GEOMETRY_FILTER) {
                removeGeometryFilter();
            } else {
                const filters = angular.copy(vm.textFilters);

                delete filters[filterSlug];

                applyFilters(filters);
            }
        };

        function updateFilters () {
            vm.formattedActiveFilters = [];

            if (vm.geometryFilter.markers.length > 2) {
                vm.formattedActiveFilters.push({
                    slug: GEOMETRY_FILTER,
                    label: 'Locatie',
                    option: {
                        label: 'ingetekend (' + vm.geometryFilter.description + ')'
                    }
                });
            }

            if (angular.isObject(vm.availableFilters)) {
                const textFilters = vm.availableFilters
                    .filter(filter => angular.isString(vm.textFilters[filter.slug]))
                    .map(filter => {
                        // If there are no options but the filter is active, adding the filtered
                        // value as an option with 0 values available
                        if (filter.numberOfOptions === 0) {
                            filter.numberOfOptions = 1;
                            filter.options = [{
                                id: vm.textFilters[filter.slug],
                                label: vm.textFilters[filter.slug],
                                count: 0
                            }];
                        }
                        return {
                            slug: filter.slug,
                            label: filter.label,
                            option: filter.options.find(opt => opt.id === vm.textFilters[filter.slug])
                        };
                    });
                vm.formattedActiveFilters = vm.formattedActiveFilters.concat(textFilters);
            }
        }

        function removeGeometryFilter () {
            store.dispatch({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: vm.dataset,
                    geometryFilter: {
                        markers: [],
                        description: ''
                    },
                    page: 1
                }
            });
        }

        function applyFilters (filters) {
            store.dispatch({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: vm.dataset,
                    filters: filters,
                    page: 1
                }
            });
        }
    }
}))();
