(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionActiveFilters', {
            bindings: {
                dataset: '@',
                availableFilters: '=',
                activeFilters: '='
            },
            templateUrl: 'modules/data-selection/components/active-filters/active-filters.html',
            controller: DpDataSelectionActiveFilterController,
            controllerAs: 'vm'
        });

    DpDataSelectionActiveFilterController.$inject = ['$scope', 'store', 'ACTIONS'];

    function DpDataSelectionActiveFilterController ($scope, store, ACTIONS) {
        var vm = this;

        $scope.$watchGroup(['vm.dataset', 'vm.activeFilters'], updateFilters, true);

        vm.removeFilter = function (filterSlug) {
            var filters = angular.copy(vm.activeFilters);

            delete filters[filterSlug];

            applyFilters(filters);
        };

        function updateFilters () {
            if (angular.isObject(vm.availableFilters)) {
                vm.formattedActiveFilters = vm.availableFilters.filter(filter => {
                    return angular.isString(vm.activeFilters[filter.slug]);
                }).map(function (filter) {
                    const option = filter.options.find(opt => {
                        return opt.id === vm.activeFilters[filter.slug];
                    });

                    return {
                        slug: filter.slug,
                        label: filter.label,
                        option
                    };
                });
            }
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
