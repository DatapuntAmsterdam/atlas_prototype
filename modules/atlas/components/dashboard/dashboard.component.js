import {
    hideMapPanel,
    showMapPanel
} from '../../../../src/shared/ducks/ui/ui';

(function () {
    'use strict';

    angular
        .module('atlas')
        .component('dpDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: DpDashboardController,
            controllerAs: 'vm'
        });

    DpDashboardController.$inject = ['$window', '$scope', '$timeout', 'store', 'ACTIONS', 'dashboardColumns', 'HEADER'];

    function DpDashboardController ($window, $scope, $timeout, store, ACTIONS, dashboardColumns, HEADER) {
        const vm = this;
        const endpointTypes = $window.mapPreviewPanelDetailEndpointTypes || {};

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        $scope.$watchGroup(['vm.isStraatbeeldActive', 'vm.straatbeeldHistory'], () => {
            if (vm.isStraatbeeldActive) {
                store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY.id, payload: {...store.getState().straatbeeld} });
            } else {
                $timeout(() => store.dispatch({ type: ACTIONS.MAP_REMOVE_PANO_OVERLAY.id }));
            }
        });

        $scope.$watchGroup(['vm.isEmbed', 'vm.isEmbedPreview'], () => {
            if (vm.store.getState().map.overlays.length) {
                return;
            }

            if (vm.isEmbed || vm.isEmbedPreview) {
                store.dispatch(hideMapPanel());
            }
        });

        // Show or hide React `MapPanel` app according to map fullscreen state
        $scope.$watch('vm.isMapFullscreen', (newValue, oldValue) => {
            if (newValue !== oldValue) {
                if (!vm.isMapFullscreen) {
                    // Always hide when map exits fullscreen mode
                    store.dispatch(hideMapPanel());
                } else if (vm.isHomePageActive) {
                    // Only show when coming from the home page
                    store.dispatch(showMapPanel());
                }
            }
        });

        // Open or close React `MapPreviewPanel` app
        $scope.$watchGroup([
            'vm.activity.mapPreviewPanel',
            'vm.geosearchLocation',
            'vm.detailEndpoint'
        ], () => {
            const detailActive = vm.detailEndpoint && Object
                .keys(endpointTypes)
                .some((typeKey) => vm.detailEndpoint.includes(endpointTypes[typeKey]));

            if (vm.activity.mapPreviewPanel && (vm.geosearchLocation || detailActive)) {
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

            vm.isPrintMode = state.ui.isPrintMode;
            vm.isEmbedPreview = state.ui.isEmbedPreview;
            vm.isEmbed = state.ui.isEmbed;
            vm.isPrintOrEmbedOrPreview = dashboardColumns.isPrintOrEmbedOrPreview(state);

            vm.dataSelectionState = state.dataSelection;

            vm.isRightColumnScrollable =
                vm.visibility.page ||
                vm.visibility.detail ||
                vm.visibility.searchResults ||
                vm.visibility.dataSelection;

            vm.columnSizes = dashboardColumns.determineColumnSizes(state);

            vm.isFullHeight = !vm.isRightColumnScrollable || vm.columnSizes.right < 12;

            vm.isMapFullscreen = Boolean(vm.visibility.map && state.ui.isMapFullscreen);
            vm.isStraatbeeldActive = Boolean(state.straatbeeld);
            vm.straatbeeldHistory = vm.isStraatbeeldActive ? state.straatbeeld.history : null;
            vm.geosearchLocation = state.search && state.search.location && state.search.location.toString();
            vm.detailEndpoint = state.detail && state.detail.endpoint;
        }
    }
})();
