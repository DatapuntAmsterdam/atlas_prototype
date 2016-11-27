(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelection', {
            templateUrl: 'modules/data-selection/components/data-selection/data-selection.html',
            bindings: {
                state: '='
            },
            controller: DpDataSelectionController,
            controllerAs: 'vm'
        });

    DpDataSelectionController.$inject = ['$scope', 'dataSelectionApi', 'dataSelectionConfig', 'DATA_SELECTION'];

    function DpDataSelectionController ($scope, dataSelectionApi, dataSelectionConfig, DATA_SELECTION) {
        // Test for ES6
        let vm = this;

        vm.isTableView = function () {
            return vm.state.view === DATA_SELECTION.VIEW_TABLE;
        };

        vm.isListView = function () {
            return vm.state.view === DATA_SELECTION.VIEW_LIST;
        };

        $scope.$watch('vm.state', fetchData, true);

        function fetchData () {
            vm.isLoading = true;

            vm.currentPage = vm.state.page;

            dataSelectionApi.query(vm.state.dataset, vm.state.filters, vm.currentPage).then((data) => {
                vm.title = dataSelectionConfig.bag.TITLE;
                vm.availableFilters = data.filters;
                vm.tableData = data.tableData;
                vm.listData = data.listData;
                vm.numberOfRecords = data.number_of_records;
                vm.numberOfPages = data.number_of_pages;
                vm.noDataToDisplay = vm.currentPage > dataSelectionConfig.MAX_AVAILABLE_PAGES;
                vm.isLoading = false;
            });
        }
    }
})();
