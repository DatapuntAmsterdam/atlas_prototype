(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .component('dpDataSharedFilters', {
            bindings: {
                config: '<',
                updateAction: '@',
                updatePayload: '<',
                availableFilters: '=',
                activeFilters: '=',
                isLoading: '='
            },
            templateUrl: 'modules/data-shared/components/filters/filters.html',
            controller: DpDataSharedFilterController,
            controllerAs: 'vm'
        });

    DpDataSharedFilterController.$inject = ['$scope', 'store'];

    function DpDataSharedFilterController ($scope, store) {
        var vm = this,
            expandedCategories = [];

        $scope.$watch('vm.activeFilters', updateFilters, true);

        vm.showMoreThreshold = 10;

        vm.hasSelectableValues = function (category) {
            var nValues = 0;
            angular.forEach(category.options, function (option) {
                nValues += vm.isFilterActive(category.slug, option.label) ? 0 : 1;
            });
            return nValues > 0;
        };

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

            return !vm.isExpandedCategory(categorySlug) && numberOfOptions > vm.showMoreThreshold;
        };

        vm.nrHiddenOptions = function (category) {
            return category.numberOfOptions - category.options.length;
        };

        vm.expandCategory = function (categorySlug) {
            expandedCategories.push(categorySlug);
        };

        vm.implodeCategory = function (categorySlug) {
            var index = expandedCategories.indexOf(categorySlug);
            if (index >= 0) {
                expandedCategories.splice(index, 1);
            }
        };

        vm.isExpandedCategory = function (categorySlug) {
            return expandedCategories.indexOf(categorySlug) !== -1;
        };

        function updateFilters () {
            vm.formattedActiveFilters = vm.config.FILTERS.filter(function (filter) {
                return angular.isString(vm.activeFilters[filter.slug]);
            }).map(function (filter) {
                return {
                    categorySlug: filter.slug,
                    categoryLabel: filter.label,
                    format: filter.format,
                    option: vm.activeFilters[filter.slug]
                };
            });
        }

        function applyFilters (filters) {
            store.dispatch({
                type: vm.updateAction,
                payload: angular.extend({}, vm.updatePayload, {
                    filters: filters,
                    page: 1
                })
            });
        }
    }
})();
