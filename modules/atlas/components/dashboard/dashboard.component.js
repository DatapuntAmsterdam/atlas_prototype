(function () {
    'use strict';

    angular
        .module('atlas')
        .component('dpDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: DpDashboardController,
            controllerAs: 'vm'
        });

    DpDashboardController.$inject = ['$scope', '$timeout', 'store', 'ACTIONS', 'dashboardColumns', 'HEADER'];

    function DpDashboardController ($scope, $timeout, store, ACTIONS, dashboardColumns, HEADER) {
        const vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        $scope.$watch(() => dashboardColumns.determineVisibility(store.getState()).httpStatus, setLayout);
        $scope.$watchGroup(['vm.isStraatbeeldActive', 'vm.straatbeeldHistory'], () => {
            if (vm.isStraatbeeldActive) {
                store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY });
            } else {
                $timeout(() => store.dispatch({ type: ACTIONS.MAP_REMOVE_PANO_OVERLAY }));
            }
        });

        $scope.$watchGroup(['vm.isEmbed', 'vm.isEmbedPreview'], () => {
            if (vm.store.getState().map.overlays.length) {
                return;
            }

            if (vm.isEmbed || vm.isEmbedPreview) {
                store.dispatch({ type: 'HIDE_MAP_PANEL' });
            }
        });

        // Show or hide React `MapPanel` app according to map fullscreen state
        $scope.$watch('vm.isMapFullscreen', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                if (!vm.isMapFullscreen) {
                    // Always hide when map exits fullscreen mode
                    store.dispatch({ type: 'HIDE_MAP_PANEL' });
                } else if (vm.isHomePageActive) {
                    // Only show when coming from the home page
                    store.dispatch({ type: 'SHOW_MAP_PANEL' });
                }
            }
        });

        // Open or close React `MapPreviewPanel` app
        $scope.$watchGroup([
            'vm.visibility.mapPreviewPanel',
            'vm.geosearchLocation',
            'vm.detailEndpoint'
        ], () => {
            if (vm.visibility.mapPreviewPanel && (vm.geosearchLocation || vm.detailEndpoint)) {
                store.dispatch({ type: 'OPEN_MAP_PREVIEW_PANEL' });
            } else {
                store.dispatch({ type: 'CLOSE_MAP_PREVIEW_PANEL' });
            }
        });

        function setLayout () { // eslint-disable-line complexity
            const state = store.getState();

            vm.user = state.user;

            vm.activity = dashboardColumns.determineActivity(state);
            vm.visibility = dashboardColumns.determineVisibility(state);

            vm.hasMaxWidth = vm.visibility.page;
            vm.isHomePageActive = state.page && state.page.name === 'home';
            vm.isHomePage = vm.visibility.page && vm.isHomePageActive;
            vm.headerSize = vm.isHomePage ? HEADER.SIZE.TALL : HEADER.SIZE.SHORT;
            vm.pageType = state.page && state.page.type ? state.page.type : '';

            vm.isPrintMode = state.atlas.isPrintMode;
            vm.isEmbedPreview = state.atlas.isEmbedPreview;
            vm.isEmbed = state.atlas.isEmbed;
            vm.isPrintOrEmbedOrPreview = dashboardColumns.isPrintOrEmbedOrPreview(state);

            vm.dataSelectionState = state.dataSelection;

            vm.isRightColumnScrollable =
                vm.visibility.page ||
                vm.visibility.detail ||
                vm.visibility.searchResults ||
                vm.visibility.dataSelection;

            vm.columnSizes = dashboardColumns.determineColumnSizes(state);

            vm.isFullHeight = !vm.isRightColumnScrollable || vm.columnSizes.right < 12;

            vm.isMapFullscreen = Boolean(vm.visibility.map && state.map.isFullscreen);
            vm.isStraatbeeldActive = Boolean(state.straatbeeld);
            vm.straatbeeldHistory = vm.isStraatbeeldActive ? state.straatbeeld.history : null;
            vm.geosearchLocation = state.search && state.search.location && state.search.location.toString();
            vm.detailEndpoint = state.detail && state.detail.endpoint;
        }
    }
})();
