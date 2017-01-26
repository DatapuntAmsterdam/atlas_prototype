(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionAvailableFilters', {
            bindings: {
                dataset: '@',
                availableFilters: '=',
                activeFilters: '=',
                isLoading: '='
            },
            templateUrl: 'modules/data-selection/components/available-filters/available-filters.html',
            controller: DpDataSelectionAvailableFiltersController,
            controllerAs: 'vm'
        });

    DpDataSelectionAvailableFiltersController.$inject = ['$scope', 'store', 'ACTIONS', 'DATA_SELECTION_CONFIG'];

    function DpDataSelectionAvailableFiltersController ($scope, store, ACTIONS, DATA_SELECTION_CONFIG) {
        var vm = this,
            expandedFilters = [];

        $scope.$watch('vm.dataset', updateConfig, true);

        vm.showMoreThreshold = 10;

        vm.hasInactiveFilterOptions = function (filter) {
            return filter.options.some(option => !vm.isFilterOptionActive(filter.slug, option.label));
        };

        vm.isFilterOptionActive = function (filterSlug, optionId) {
            return vm.activeFilters[filterSlug] === optionId;
        };

        vm.addFilter = function (filterSlug, optionId) {
            var filters = angular.copy(vm.activeFilters);

            filters[filterSlug] = optionId;

            applyFilters(filters);
        };

        vm.showExpandButton = function (filterSlug) {
            return !vm.isExpandedFilter(filterSlug) && getAvailableOptions(filterSlug).length > vm.showMoreThreshold;
        };

        vm.nrHiddenOptions = function (filter) {
            return filter.numberOfOptions - filter.options.length;
        };

        vm.expandFilter = function (filterSlug) {
            expandedFilters.push(filterSlug);
        };

        vm.implodeFilter = function (filterSlug) {
            var index = expandedFilters.indexOf(filterSlug);
            if (index >= 0) {
                expandedFilters.splice(index, 1);
            }
        };

        vm.isExpandedFilter = function (filterSlug) {
            return expandedFilters.indexOf(filterSlug) !== -1;
        };

        vm.canExpandImplode = function (filterSlug) {
            return getAvailableOptions(filterSlug).length > vm.showMoreThreshold;
        };

        function getAvailableOptions (filterSlug) {
            return getAvailableFilters(filterSlug)[0].options;
        }

        function getAvailableFilters (filterSlug) {
            return vm.availableFilters.filter(filter => filter.slug === filterSlug);
        }

        function updateConfig () {
            vm.showOptionCounts = DATA_SELECTION_CONFIG.datasets[vm.dataset].SHOW_FILTER_OPTION_COUNTS;
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
