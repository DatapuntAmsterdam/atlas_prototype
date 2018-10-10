import { mapLoadingAction } from '../../../../src/map/ducks/map/map';

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
                zoomLevel: '<'
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

        vm.showCatalogusIntroduction = vm.state.view === 'CATALOG' &&
            userSettings.showCatalogusIntroduction.value === true.toString();

        $scope.$watch('vm.showCatalogusIntroduction', function () {
            userSettings.showCatalogusIntroduction.value = vm.showCatalogusIntroduction.toString();
        });

        $scope.$watchGroup([
            // Watching all state variables except markers and isLoading
            'vm.boundingBox',
            'vm.catalogFilters',
            'vm.filters',
            'vm.state.dataset',
            'vm.state.geometryFilter',
            'vm.state.page',
            'vm.state.query',
            'vm.state.view',
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
            const config = DATA_SELECTION_CONFIG.datasets[vm.state.dataset];
            const isListView = vm.state.view === 'LIST';
            vm.view = vm.state.view;

            const isQueryView = angular.isDefined(vm.state.query) && vm.state.query.trim().length >= 1;
            vm.showTabHeader = () => (vm.view === 'CATALOG') && isQueryView;
            vm.currentPage = vm.state.page;

            vm.numberOfRecords = null;
            vm.numberOfPages = null;

            if (config.AUTH_SCOPE && !vm.user.scopes.includes(config.AUTH_SCOPE)) {
                vm.disabled = true;
                vm.notAuthorizedMessageSrc =
                    `modules/data-selection/components/data-selection/not-authorized-message/${vm.state.dataset}.html`;
                vm.availableFilters = [];
                store.dispatch({
                    type: ACTIONS.SHOW_DATA_SELECTION,
                    payload: []
                });
                return;
            }

            vm.showContent = false;
            vm.isLoading = !vm.showContent;
            vm.disabled = false;

            const activeFilters = angular.extend({
                shape: angular.toJson(vm.state.geometryFilter.markers.map(([lat, lng]) => [lng, lat]))
            }, vm.filters);

            /** Load Basic BAG Information */
            dataSelectionApi.query(
                vm.state.dataset,
                vm.state.view,
                vm.filters,
                vm.currentPage,
                vm.state.query,
                vm.state.geometryFilter.markers,
                vm.catalogFilters
            ).then((data) => {
                vm.showContent = true;
                vm.isLoading = !vm.showContent;

                vm.availableFilters = data.filters;
                vm.data = data.data;
                vm.numberOfRecords = data.numberOfRecords;
                vm.numberOfPages = data.numberOfPages;

                vm.showFilters = !isListView && vm.numberOfRecords > 0;

                updateTabHeader(vm.state.query, vm.numberOfRecords);

                /** Determine if warning messages should be shown */
                vm.maxAvailablePages =
                    DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES;
                vm.showMessageMaxPages = vm.maxAvailablePages &&
                    vm.state.page > vm.maxAvailablePages;

                vm.showContent = vm.numberOfRecords && (
                    angular.isUndefined(vm.maxAvailablePages) ||
                    vm.state.page <= vm.maxAvailablePages
                );

                vm.maxNumberOfClusteredMarkers =
                    DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_NUMBER_OF_CLUSTERED_MARKERS;
                vm.showMessageClusteredMarkers = isListView &&
                    vm.numberOfRecords > vm.maxNumberOfClusteredMarkers;

                if (vm.state.reset) {
                    /** Update state to show the data, do not trigger a url state change however */
                    store.dispatch({
                        type: ACTIONS.RESET_DATA_SELECTION,
                        payload: []
                    });
                }
            });

            if (isListView) { /** Load geolocation markers for clusters */
                store.dispatch(mapLoadingAction(true));
                dataSelectionApi.getMarkers(
                    vm.state.dataset,
                    activeFilters,
                    vm.zoomLevel,
                    vm.boundingBox
                ).then((data) => {
                    if (vm.numberOfRecords <= vm.maxNumberOfClusteredMarkers) {
                        /** Update state with clusters only when maximum records isnt exceeded */
                        store.dispatch({
                            type: ACTIONS.SHOW_DATA_SELECTION,
                            payload: data
                        });
                    } else {
                        store.dispatch({
                            type: ACTIONS.SHOW_DATA_SELECTION,
                            payload: []
                        });
                    }
                }).finally(() => {
                    store.dispatch(mapLoadingAction(false));
                });
            } else {
                store.dispatch({
                    type: ACTIONS.SHOW_DATA_SELECTION,
                    payload: []
                });
            }
        }
    }
})();
