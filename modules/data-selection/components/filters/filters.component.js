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
            expandedFilters = [];

        $scope.$watchGroup(['vm.dataset', 'vm.activeFilters'], updateFilters, true);

        vm.showMoreThreshold = 10;

        vm.hasInactiveFilterOptions = function (filter) {
            return filter.options.some(option => {
                return !vm.isFilterOptionActive(filter.slug, option.label);
            });
        };

        vm.isFilterOptionActive = function (filterSlug, optionId) {
            return vm.activeFilters[filterSlug] === optionId;
        };

        vm.addFilter = function (filterSlug, optionId) {
            var filters = angular.copy(vm.activeFilters);

            filters[filterSlug] = optionId;

            applyFilters(filters);
        };

        vm.removeFilter = function (filterSlug) {
            var filters = angular.copy(vm.activeFilters);

            delete filters[filterSlug];

            applyFilters(filters);
        };

        vm.showExpandButton = function (filterSlug) {
            var numberOfOptions;

            numberOfOptions = vm.availableFilters.filter(function (availableFilter) {
                return availableFilter.slug === filterSlug;
            })[0].options.length;

            return !vm.isExpandedFilter(filterSlug) && numberOfOptions > vm.showMoreThreshold;
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
            let availableFilters = vm.availableFilters.filter(function (availableFilter) {
                return availableFilter.slug === filterSlug;
            });
            return availableFilters && availableFilters[0].options.length > vm.showMoreThreshold;
        };

        function updateFilters () {
            if (angular.isObject(vm.availableFilters)) {
                vm.showOptionCounts = DATA_SELECTION_CONFIG[vm.dataset].SHOW_FILTER_OPTION_COUNTS;

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
