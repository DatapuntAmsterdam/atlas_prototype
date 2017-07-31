((() => {
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
        'ACTIONS',
        'user'
    ];

    function DpDataSelectionController (
        $scope,
        userSettings,
        dataSelectionApi,
        DATA_SELECTION_CONFIG,
        TabHeader,
        store,
        ACTIONS,
        user) {
        const vm = this;

        vm.showCatalogusIntroduction = vm.state.view === 'CARDS' &&
            userSettings.showCatalogusIntroduction.value === true.toString();

        $scope.$watch('vm.showCatalogusIntroduction', () => {
            userSettings.showCatalogusIntroduction.value = vm.showCatalogusIntroduction.toString();
        });

        $scope.$watch(() => // Watching all state variables except markers and isLoading
        [
            vm.state.dataset,
            vm.state.view,
            vm.state.filters,
            vm.state.geometryFilter,
            vm.state.page,
            vm.state.query,
            user.getAuthorizationLevel()
        ], fetchData, true);

        vm.tabHeader = new TabHeader('data-datasets');
        vm.tabHeader.activeTab = vm.tabHeader.getTab('datasets');

        function updateTabHeader (query, count) {
            if (vm.showTabHeader()) {
                vm.tabHeader.query = query;
                vm.tabHeader.getTab('datasets').count = count;
            }
        }

        function fetchData () {
            const config = DATA_SELECTION_CONFIG.datasets[vm.state.dataset];

            const isListView = vm.state.view === 'LIST';
            vm.view = vm.state.view;

            const isQueryView = angular.isDefined(vm.state.query) && vm.state.query.trim().length >= 1;
            vm.showTabHeader = () => vm.view === 'CARDS' && isQueryView;
            vm.currentPage = vm.state.page;

            vm.numberOfRecords = null;
            vm.numberOfPages = null;

            vm.showContent = false;
            vm.disabled = false;

            if (config.AUTH_LEVEL && !user.meetsRequiredLevel(config.AUTH_LEVEL)) {
                vm.disabled = true;
                vm.availableFilters = [];
                store.dispatch({
                    type: ACTIONS.SHOW_DATA_SELECTION,
                    payload: []
                });
                return;
            }

            vm.isLoading = true;

            dataSelectionApi.query(vm.state.dataset,
                vm.state.view,
                vm.state.filters,
                vm.currentPage,
                vm.state.query,
                vm.state.geometryFilter.markers).then(data => {
                    vm.isLoading = false;
                    vm.availableFilters = data.filters;

                    vm.data = data.data;
                    vm.numberOfRecords = data.numberOfRecords;
                    vm.numberOfPages = data.numberOfPages;

                    vm.showFilters = !isListView && vm.numberOfRecords > 0;

                    // determine if warning messages should be shown
                    vm.maxAvailablePages = DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES;
                    vm.showMessageMaxPages = vm.maxAvailablePages && vm.state.page > vm.maxAvailablePages;

                    vm.maxNumberOfClusteredMarkers = DATA_SELECTION_CONFIG.options.MAX_NUMBER_OF_CLUSTERED_MARKERS;
                    vm.showMessageClusteredMarkers = isListView && vm.numberOfRecords > vm.maxNumberOfClusteredMarkers;

                    updateTabHeader(vm.state.query, vm.numberOfRecords);

                    vm.showContent =
                        vm.numberOfRecords &&
                        (
                            angular.isUndefined(DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES) ||
                            vm.state.page <= DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES
                        );

                    const activeFilters = angular.extend({
                        shape: angular.toJson(vm.state.geometryFilter.markers.map(([lat, lng]) => [lng, lat]))
                    }, vm.state.filters);

                    if (
                        isListView &&
                        vm.numberOfRecords <= DATA_SELECTION_CONFIG.options.MAX_NUMBER_OF_CLUSTERED_MARKERS
                    ) {
                        // Get marker data and update the state to show the
                        // data
                        dataSelectionApi.getMarkers(vm.state.dataset, activeFilters).then(markerData => {
                            store.dispatch({
                                type: ACTIONS.SHOW_DATA_SELECTION,
                                payload: markerData
                            });
                        });
                    } else if (vm.state.reset) {
                        // Update the state to show the data, do not trigger a
                        // url state change however
                        store.dispatch({
                            type: ACTIONS.RESET_DATA_SELECTION,
                            payload: []
                        });
                    } else {
                        // Update the state to show the data
                        store.dispatch({
                            type: ACTIONS.SHOW_DATA_SELECTION,
                            payload: []
                        });
                    }
                });
        }
    }
}))();
