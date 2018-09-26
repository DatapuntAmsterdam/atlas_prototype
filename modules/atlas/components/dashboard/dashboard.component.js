import PAGES from '../../../../src/pages';
import {
    hideMapPanel, MAP_MODE,
    showMapPanel
} from '../../../../src/shared/ducks/ui/ui';

(function () {
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
        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        $scope.$watchGroup(['vm.mapMode'], () => {
            if (vm.mapMode === MAP_MODE.PANORAMA) {
                store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY, payload: store.getState().straatbeeld });
            } else {
                $timeout(() => store.dispatch({ type: ACTIONS.MAP_REMOVE_PANO_OVERLAY }));
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

        function setLayout () { // eslint-disable-line complexity
            const state = store.getState();

            vm.user = state.user;

            vm.activity = dashboardColumns.determineActivity(state);
            vm.visibility = dashboardColumns.determineVisibility(state);
            vm.columnSizes = dashboardColumns.determineColumnSizes(state);

            vm.isHomePage = state.ui.page === PAGES.HOME;
            vm.isHomePageActive = vm.isHomePage;

            //
            // Previous logic
            //
            vm.hasMaxWidth = vm.visibility.page;

            vm.headerSize = vm.isHomePage ? HEADER.SIZE.TALL : HEADER.SIZE.SHORT;
            vm.pageType = state.page && state.page.type ? state.page.type : '';

            vm.isPrintMode = state.ui.isPrintMode;
            vm.isEmbedPreview = state.ui.isEmbedPreview;
            vm.isEmbed = state.ui.isEmbed;
            vm.isPrintOrEmbedOrPreview = dashboardColumns.isPrintOrEmbedOrPreview(state);

            vm.isRightColumnScrollable =
                vm.visibility.page ||
                vm.visibility.detail ||
                vm.visibility.searchResults ||
                vm.visibility.dataSelection;

            vm.isFullHeight = !vm.isRightColumnScrollable || vm.columnSizes.right < 12;

            vm.mapMode = state.ui.mapMode;
            vm.geosearchLocation = state.search && state.search.location && state.search.location.toString();
            vm.detailEndpoint = state.detail && state.detail.endpoint; // TODO remove? Seems useless
        }
    }
})();
