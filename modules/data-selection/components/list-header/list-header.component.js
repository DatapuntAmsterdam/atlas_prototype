(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionListHeader', {
            bindings: {
                state: '=',
                numberOfRecords: '=',
                headerTitle: '<'
            },
            templateUrl: 'modules/data-selection/components/list-header/list-header.html',
            controller: DpDataSelectionListHeader,
            controllerAs: 'vm'
        });

    DpDataSelectionListHeader.$inject = ['$scope', 'dataSelectionConfig', 'DATA_SELECTION'];

    function DpDataSelectionListHeader ($scope, dataSelectionConfig, DATA_SELECTION) {
        var vm = this;

        vm.tableView = DATA_SELECTION.VIEW_TABLE;

        $scope.$watch('vm.state.filters', updateFilters, true);

        function updateFilters () {
            vm.formattedActiveFilters = dataSelectionConfig[vm.state.dataset].FILTERS.filter(function (filter) {
                return angular.isString(vm.state.filters[filter.slug]);
            }).map(function (filter) {
                return {
                    categorySlug: filter.slug,
                    categoryLabel: filter.label,
                    format: filter.format,
                    option: vm.state.filters[filter.slug]
                };
            });
        }
    }
})();
