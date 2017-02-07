(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionActiveFilters', {
            bindings: {
                dataset: '@',
                availableFilters: '=',
                activeFilters: '=',
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

        $scope.$watchGroup(['vm.dataset', 'vm.activeFilters'], updateFilters, true);

        vm.removeFilter = function (filterSlug) {
            if (filterSlug === GEOMETRY_FILTER) {
                removeGeometryFilter();
            } else {
                let filters = angular.copy(vm.activeFilters);

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
                let textFilters = vm.availableFilters
                    .filter(filter => angular.isString(vm.activeFilters[filter.slug]))
                    .map(filter => {
                        return {
                            slug: filter.slug,
                            label: filter.label,
                            option: filter.options.find(opt => opt.id === vm.activeFilters[filter.slug])
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
                    geometryFilter: [],
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
})();
