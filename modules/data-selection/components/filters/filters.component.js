(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionFilters', {
            bindings: {
                dataset: '@',
                availableFilters: '=',
                activeFilters: '=',
                isLoading: '='
            },
            templateUrl: 'modules/data-selection/components/filters/filters.html',
            controller: DpDataSelectionFilterController,
            controllerAs: 'vm'
        });

    DpDataSelectionFilterController.$inject = ['$scope', 'store', 'ACTIONS', 'DATA_SELECTION_CONFIG'];

    function DpDataSelectionFilterController ($scope, store, ACTIONS, DATA_SELECTION_CONFIG) {
        var vm = this,
            expandedCategories = [];

        $scope.$watch('vm.activeFilters', updateFilters, true);

        vm.isFilterActive = function (categorySlug, filterLabel) {
            return vm.activeFilters[categorySlug] === filterLabel;
        };

        vm.addFilter = function (categorySlug, filterLabel) {
            var filters = angular.copy(vm.activeFilters);

            filters[categorySlug] = filterLabel;

            applyFilters(filters);
        };

        vm.removeFilter = function (categorySlug) {
            var filters = angular.copy(vm.activeFilters);

            delete filters[categorySlug];

            applyFilters(filters);
        };

        vm.showExpandButton = function (categorySlug) {
            var numberOfOptions;

            numberOfOptions = vm.availableFilters.filter(function (availableFilter) {
                return availableFilter.slug === categorySlug;
            })[0].options.length;

            return !vm.isExpandedCategory(categorySlug) && numberOfOptions > 10;
        };

        vm.expandCategory = function (categorySlug) {
            expandedCategories.push(categorySlug);
        };

        vm.isExpandedCategory = function (categorySlug) {
            return expandedCategories.indexOf(categorySlug) !== -1;
        };

        function updateFilters () {
            vm.formattedActiveFilters = DATA_SELECTION_CONFIG[vm.dataset].FILTERS.filter(function (filter) {
                return angular.isString(vm.activeFilters[filter.slug]);
            }).map(function (filter) {
                return {
                    categorySlug: filter.slug,
                    categoryLabel: filter.label,
                    option: vm.activeFilters[filter.slug]
                };
            });
        }

        function applyFilters (filters) {
            store.dispatch({
                type: ACTIONS.SHOW_DATA_SELECTION,
                payload: {
                    dataset: vm.dataset,
                    filters: filters,
                    page: 1
                }
            });
        }
    }
})();