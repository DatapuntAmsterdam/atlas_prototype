import ACTIONS from '../../../../src/shared/actions';

(function () {
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

    DpDataSelectionActiveFilterController.$inject = ['$scope', 'store'];

    function DpDataSelectionActiveFilterController ($scope, store) {
        var vm = this;

        const GEOMETRY_FILTER = 'GEOMETRY_FILTER';  // Identification for a geometry filter

        $scope.$watchGroup(['vm.dataset', 'vm.textFilters'], updateFilters, true);

        vm.removeFilter = function (filterSlug) {
            const filters = angular.copy(vm.textFilters);
            if (filterSlug === GEOMETRY_FILTER) {
                removeGeometryFilter();
            } else {
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
                    option: 'ingetekend (' + vm.geometryFilter.description + ')'
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
                            option: getValue(filter)
                        };
                    });
                vm.formattedActiveFilters = vm.formattedActiveFilters.concat(textFilters);
            }
        }

        function getValue (filter) {
            const value = vm.textFilters[filter.slug],
                option = filter.options.find(opt => opt.id === value);

            return value.match(/^\[.*\]$/) ? value.replace(/['\[\]]/g, '') : option && option.label;
        }

        function removeGeometryFilter (filters) {
            store.dispatch({
                type: ACTIONS.FETCH_DATA_SELECTION,
                payload: {
                    dataset: vm.dataset,
                    resetGeometryFilter: true,
                    page: 1
                }
            });
        }

        function applyFilters (filters) {
            store.dispatch({
                type: ACTIONS.APPLY_FILTERS,
                payload: filters
            });
        }
    }
})();
