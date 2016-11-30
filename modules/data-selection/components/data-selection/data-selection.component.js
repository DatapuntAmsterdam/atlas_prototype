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
        let vm = this;

        $scope.$watch('vm.state', fetchData, true);

        function fetchData () {
            vm.isLoading = true;

            vm.title = dataSelectionConfig[vm.state.dataset].TITLE;
            vm.view = vm.state.view;
            vm.showFilters = vm.state.view === 'TABLE';
            vm.currentPage = vm.state.page;
            vm.isPageAvailable = vm.currentPage <= dataSelectionConfig.MAX_AVAILABLE_PAGES;

            dataSelectionApi.query(vm.state.dataset, vm.state.view, vm.state.filters, vm.currentPage).then((data) => {
                vm.availableFilters = data.filters;
                vm.data = data.data;

                vm.numberOfRecords = data.number_of_records;
                vm.numberOfPages = data.number_of_pages;

                vm.isLoading = false;
            });
        }
    }
})();
