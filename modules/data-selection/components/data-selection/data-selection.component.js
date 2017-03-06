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
        'TabHeader',
        'store',
        'ACTIONS'
    ];

    function DpDataSelectionController (
        $scope,
        userSettings,
        dataSelectionApi,
        DATA_SELECTION_CONFIG,
        TabHeader,
        store,
        ACTIONS) {
        let vm = this;

        vm.showCatalogusIntroduction = vm.state.view === 'CARDS' &&
            userSettings.showCatalogusIntroduction.value === true.toString();

        vm.showTabHeader = () => Object.keys(vm.state.filters).length === 0;

        $scope.$watch('vm.showCatalogusIntroduction', function () {
            userSettings.showCatalogusIntroduction.value = vm.showCatalogusIntroduction.toString();
        });

        $scope.$watch(function () {
            // Watching all state variables except markers and isLoading
            return [
                vm.state.dataset,
                vm.state.view,
                vm.state.filters,
                vm.state.geometryFilter,
                vm.state.page,
                vm.state.query
            ];
        }, fetchData, true);

        vm.tabHeader = new TabHeader('data-datasets');
        vm.tabHeader.activeTab = vm.tabHeader.getTab('datasets');

        function updateTabHeader (query, count) {
            if (vm.view === 'CARDS') {
                vm.tabHeader.query = query;
                vm.tabHeader.getTab('datasets').count = count;
            }
        }

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
                vm.state.query,
                vm.state.geometryFilter.markers).then(data => {
                    vm.availableFilters = data.filters;

                    vm.data = data.data;
                    vm.numberOfRecords = data.numberOfRecords;
                    vm.numberOfPages = data.numberOfPages;

                    updateTabHeader(vm.state.query, vm.numberOfRecords);

                    vm.showContent =
                        vm.numberOfRecords &&
                        (
                            angular.isUndefined(DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES) ||
                            vm.state.page <= DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES
                        );

                    vm.isLoading = false;

                    let activeFilters = angular.extend({
                        shape: angular.toJson(vm.state.geometryFilter.markers.map(([lat, lng]) => [lng, lat]))
                    }, vm.state.filters);

                    if (
                        isListView &&
                        vm.numberOfRecords <= DATA_SELECTION_CONFIG.options.MAX_NUMBER_OF_CLUSTERED_MARKERS
                    ) {
                        dataSelectionApi.getMarkers(vm.state.dataset, activeFilters).then(markerData => {
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
