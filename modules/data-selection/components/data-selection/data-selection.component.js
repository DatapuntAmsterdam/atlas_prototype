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

    DpDataSelectionController.$inject = ['$scope', 'dataSelectionApi', 'dataSelectionConfig', 'store', 'ACTIONS'];

    function DpDataSelectionController ($scope, dataSelectionApi, dataSelectionConfig, store, ACTIONS) {
        let vm = this;
        const MAXIMUM_NUMBER_OF_MARKERS = 10000;

        $scope.$watch('vm.state', fetchData, true);

        function fetchData () {
            vm.isLoading = true;

            vm.title = dataSelectionConfig[vm.state.dataset].TITLE;
            vm.view = vm.state.view;
            vm.showFilters = vm.state.view === 'TABLE';
            vm.currentPage = vm.state.page;
            vm.isPageAvailable = !dataSelectionConfig.HAS_PAGE_LIMIT ||
                vm.currentPage <= dataSelectionConfig.MAX_AVAILABLE_PAGES;
            vm.hasTooManyMarkers = false;

            dataSelectionApi.query(vm.state.dataset, vm.state.view, vm.state.filters, vm.currentPage).then(data => {
                vm.availableFilters = data.filters;
                vm.data = data.data;

                vm.numberOfRecords = data.numberOfRecords;
                vm.numberOfPages = data.numberOfPages;

                vm.hasTooManyMarkers = vm.view === 'LIST' && vm.numberOfRecords > MAXIMUM_NUMBER_OF_MARKERS;
                vm.isLoading = false;

                if (vm.view === 'LIST' && vm.numberOfRecords <= MAXIMUM_NUMBER_OF_MARKERS) {
                    dataSelectionApi.getMarkers(vm.state.dataset, vm.state.filters).then(markerData => {
                        store.dispatch({
                            type: ACTIONS.SHOW_DATA_SELECTION,
                            payload: markerData
                        });
                    });
                } else {
                    store.dispatch({
                        type: ACTIONS.SHOW_DATA_SELECTION,
                        payload: []
                    });
                }
            });
        }
    }
})();
