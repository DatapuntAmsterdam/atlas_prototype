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

    DpDataSelectionController.$inject = ['$scope', 'dataSelectionApi', 'dataSelectionConfig'];

    function DpDataSelectionController ($scope, dataSelectionApi, dataSelectionConfig) {
        // Test for ES6
        let vm = this;

        $scope.$watch('vm.state', fetchData, true);

        function fetchData () {
            vm.isLoading = true;

            vm.currentPage = vm.state.page;

            dataSelectionApi.query(vm.state.dataset, vm.state.filters, vm.currentPage).then((data) => {

                vm.title = dataSelectionConfig.bag.TITLE;
                vm.availableFilters = data.filters;
                vm.tableData = data.tableData;
                vm.numberOfRecords = data.number_of_records;
                vm.numberOfPages = data.number_of_pages;
                vm.noDataToDisplay = vm.currentPage > dataSelectionConfig.MAX_AVAILABLE_PAGES;
                vm.isLoading = false;
            });
        }
    }
})();