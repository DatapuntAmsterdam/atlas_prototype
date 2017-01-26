(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelection', {
            templateUrl: 'modules/data-selection/components/data-selection/data-selection.html',
            bindings: {
                state: '<'
            },
            controller: DpDataSelectionController,
            controllerAs: 'vm'
        });

    DpDataSelectionController.$inject = [
        '$scope',
        'userSettings',
        'dataSelectionApi',
        'DATA_SELECTION_CONFIG',
        'store',
        'ACTIONS'
    ];

    function DpDataSelectionController ($scope, userSettings, dataSelectionApi, DATA_SELECTION_CONFIG, store, ACTIONS) {
        let vm = this;

        vm.showCatalogusIntroduction = vm.state.view === 'CARDS' &&
            userSettings.showCatalogusIntroduction.value === true.toString();

        $scope.$watch('vm.showCatalogusIntroduction', function () {
            userSettings.showCatalogusIntroduction.value = vm.showCatalogusIntroduction.toString();
        });

        $scope.$watch(function () {
            // Watching all state variables except markers and isLoading
            return [
                vm.state.dataset,
                vm.state.view,
                vm.state.filters,
                vm.state.page,
                vm.state.query
            ];
        }, fetchData, true);

        function fetchData () {
            let isListView = vm.state.view === 'LIST';

            vm.view = vm.state.view;
            vm.showFilters = !isListView;
            vm.currentPage = vm.state.page;

            vm.numberOfRecords = null;
            vm.numberOfPages = null;

            vm.showContent = false;
            vm.isLoading = true;

            dataSelectionApi.query(vm.state.dataset,
                vm.state.view,
                vm.state.filters,
                vm.currentPage,
                vm.state.query).then(data => {
                    vm.availableFilters = data.filters;
                    vm.data = data.data;

                    vm.numberOfRecords = data.numberOfRecords;
                    vm.numberOfPages = data.numberOfPages;

                    vm.showContent =
                        vm.numberOfRecords &&
                        (
                            angular.isUndefined(DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES) ||
                            vm.state.page <= DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES
                        );

                    vm.isLoading = false;

                    if (
                        isListView &&
                        vm.numberOfRecords <= DATA_SELECTION_CONFIG.options.MAX_NUMBER_OF_CLUSTERED_MARKERS
                    ) {
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
