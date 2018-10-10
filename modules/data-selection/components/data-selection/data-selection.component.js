(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelection', {
            templateUrl: 'modules/data-selection/components/data-selection/data-selection.html',
            bindings: {
                boundingBox: '<',
                catalogFilters: '<',
                filters: '<',
                state: '<',
                user: '<',
                zoomLevel: '<',
                view: '<',
                dataset: '<'
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
        ACTIONS
    ) {
        const vm = this;

        vm.showCatalogusIntroduction = vm.view === 'CATALOG' &&
            userSettings.showCatalogusIntroduction.value === true.toString();

        $scope.$watch('vm.showCatalogusIntroduction', function () {
            userSettings.showCatalogusIntroduction.value = vm.showCatalogusIntroduction.toString();
        });

        $scope.$watchGroup([
            // Watching all state variables except markers and isLoading
            'vm.boundingBox',
            'vm.catalogFilters',
            'vm.filters',
            'vm.dataset',
            'vm.view',
            'vm.state.geometryFilter',
            'vm.state.page',
            'vm.state.query',
            'vm.user.scopes',
            'vm.zoomLevel'
        ], fetchData);

        vm.tabHeader = new TabHeader('data-datasets');
        vm.tabHeader.activeTab = vm.tabHeader.getTab('datasets');

        function updateTabHeader (query, count) {
            if (vm.showTabHeader()) {
                vm.tabHeader.userScopes = vm.user.scopes;
                vm.tabHeader.query = query;
                vm.tabHeader.getTab('datasets').count = count;
            }
        }

        function fetchData () {
            const config = DATA_SELECTION_CONFIG.datasets[vm.dataset];
            const isListView = vm.view === 'LIST';

            const isQueryView = angular.isDefined(vm.state.query) && vm.state.query.trim().length >= 1;
            vm.showTabHeader = () => (vm.view === 'CATALOG') && isQueryView;
            vm.currentPage = vm.state.page;

            vm.numberOfRecords = null;
            vm.numberOfPages = null;

            vm.showContent = false;
            vm.disabled = false;

            if (config.AUTH_SCOPE && !vm.user.scopes.includes(config.AUTH_SCOPE)) {
                vm.disabled = true;
                vm.notAuthorizedMessageSrc =
                    `modules/data-selection/components/data-selection/not-authorized-message/${vm.dataset}.html`;
                vm.availableFilters = [];
                store.dispatch({
                    type: ACTIONS.SHOW_DATA_SELECTION,
                    payload: []
                });
                return;
            }

            vm.isLoading = true;

            dataSelectionApi
                .query(
                    vm.dataset,
                    vm.view,
                    vm.filters,
                    vm.currentPage,
                    vm.state.query,
                    vm.state.geometryFilter.markers,
                    vm.catalogFilters
                ).then(data => {
                    vm.availableFilters = data.filters;
                    vm.data = data.data;
                    vm.numberOfRecords = data.numberOfRecords;
                    vm.numberOfPages = data.numberOfPages;

                    vm.showFilters = !isListView && vm.numberOfRecords > 0;

                    // determine if warning messages should be shown
                    vm.maxAvailablePages = DATA_SELECTION_CONFIG.datasets[vm.dataset].MAX_AVAILABLE_PAGES;
                    vm.showMessageMaxPages = vm.maxAvailablePages && vm.state.page > vm.maxAvailablePages;

                    vm.maxNumberOfClusteredMarkers =
                        DATA_SELECTION_CONFIG.datasets[vm.dataset].MAX_NUMBER_OF_CLUSTERED_MARKERS;
                    vm.showMessageClusteredMarkers = isListView && vm.numberOfRecords > vm.maxNumberOfClusteredMarkers;

                    updateTabHeader(vm.state.query, vm.numberOfRecords);

                    vm.showContent =
                        vm.numberOfRecords &&
                        (
                            angular.isUndefined(vm.maxAvailablePages) ||
                            angular.isUndefined(vm.state.page) ||
                            vm.state.page <= vm.maxAvailablePages // TODO refactor, get page through query parameter
                        );

                    const activeFilters = angular.extend({
                        shape: angular.toJson(vm.state.geometryFilter.markers.map(([lat, lng]) => [lng, lat]))
                    }, vm.filters);

                    if (isListView && vm.numberOfRecords <= vm.maxNumberOfClusteredMarkers) {
                        // Get marker data and update the state to show the
                        // data
                        dataSelectionApi
                            .getMarkers(vm.dataset, activeFilters, vm.zoomLevel, vm.boundingBox)
                            .then(markerData => {
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
                }).finally(() => {
                    vm.isLoading = false;
                });
        }
    }
})();
