import PAGES from '../../../../src/pages';
import {
    hideMapPanel,
    showMapPanel
} from '../../../../src/shared/ducks/ui/ui';
import {
    closeMapPreviewPanel,
    openMapPreviewPanel
} from '../../../../src/map/ducks/preview-panel/map-preview-panel';

(function () {
    angular
        .module('atlas')
        .component('dpDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: DpDashboardController,
            controllerAs: 'vm'
        });

    DpDashboardController.$inject = ['$window', '$scope', '$timeout', 'store', 'ACTIONS', 'dashboardColumns', 'HEADER'];

    function DpDashboardController($window, $scope, $timeout, store, ACTIONS, dashboardColumns, HEADER) {
        const vm = this;
        const endpointTypes = $window.mapPreviewPanelDetailEndpointTypes || {};
        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        $scope.$watchGroup(['vm.isStraatbeeldActive', 'vm.straatbeeldHistory'], () => {
            if (vm.isStraatbeeldActive) {
                store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY.id, payload: store.getState().straatbeeld });
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

        // // Open or close React `MapPreviewPanel` app
        // $scope.$watchGroup([  // TODO: REMOVE THIS MESS
        //     'vm.activity.mapPreviewPanel',
        //     'vm.geosearchLocation',
        //     'vm.detailEndpoint'
        // ], () => {
        //     const detailActive = vm.detailEndpoint && Object
        //         .keys(endpointTypes)
        //         .some((typeKey) => vm.detailEndpoint.includes(endpointTypes[typeKey]));
        //
        //     if (vm.activity.mapPreviewPanel && (vm.geosearchLocation || detailActive)) { // TODO GET RID OF THIS
        //         store.dispatch(openMapPreviewPanel());
        //     } else {
        //         store.dispatch(closeMapPreviewPanel());
        //     }
        // });

        function setLayout() { // eslint-disable-line complexity
            const state = store.getState();

            vm.user = state.user;

            vm.activity = dashboardColumns.determineActivity(state);
            vm.visibility = dashboardColumns.determineVisibility(state);

            //
            // ROUTING
            //
            // Translates ui.page to old style range of variables
            // disable all previous activity and visibility logic
            vm.activity = {
                dataSelection: false,
                detail: false,
                map: false,
                mapPreviewPanel: false,
                page: false,
                searchResults: false,
                straatbeeld: false
            };
            vm.visibility = {
                error: false,
                map: false,
                straatbeeld: false,
                detail: false,
                page: false,
                searchResults: false,
                dataSelection: false
            };

            const isCmsPage =
                state.ui.page === PAGES.NIEUWS ||
                state.ui.page === PAGES.HELP ||
                state.ui.page === PAGES.PROCLAIMER ||
                state.ui.page === PAGES.BEDIENING ||
                state.ui.page === PAGES.BEDIENING ||
                state.ui.page === PAGES.GEGEVENS ||
                state.ui.page === PAGES.OVER_API ||
                state.ui.page === PAGES.PRIVACY_BEVEILIGING ||
                state.ui.page === PAGES.BESCHIKBAAR_KWALITEIT ||
                state.ui.page === PAGES.STATISTIEKEN ||
                state.ui.page === PAGES.BEHEER_WERKWIJZE;

            vm.isHomePage = state.ui.page === PAGES.HOME;
            vm.isHomePageActive = vm.isHomePage;
            vm.activity.dataSelection = state.ui.page === PAGES.ADRESSEN ||
                state.ui.page === PAGES.KAART_ADRESSSEN ||
                state.ui.page === PAGES.DATASETS ||
                state.ui.page === PAGES.SEARCH_DATASETS;
            vm.visibility.dataSelection = vm.activity.dataSelection;
            vm.activity.page = state.ui.page === PAGES.HOME || isCmsPage;
            vm.visibility.page = vm.activity.page;
            vm.activity.map = state.ui.page === PAGES.KAART ||
                state.ui.page === PAGES.KAART_DETAIL ||
                state.ui.page === PAGES.KAART_PANORAMA ||
                state.ui.page === PAGES.KAART_ADRESSSEN ||
                state.ui.page === PAGES.KAART_SEARCH;

            vm.visibility.map = vm.activity.map;
            vm.activity.straatbeeld = state.ui.page === PAGES.PANORAMA ||
                state.ui.page === PAGES.KAART_PANORAMA;
            vm.visibility.straatbeeld = vm.activity.straatbeeld;

            vm.activity.searchResults = state.ui.page === PAGES.KAART_SEARCH ||
                state.ui.page === PAGES.SEARCH_DATA;
            vm.visibility.searchResults = vm.activity.searchResults;

            vm.activity.detail = state.ui.page === PAGES.KAART_DETAIL ||
                state.ui.page === PAGES.DATASETS_DETAIL;
            vm.visibility.detail = vm.activity.detail;

            vm.columnSizes = {
                left: 4,
                middle: 4,
                right: 4
            };

            if (vm.isHomePage) {
                vm.columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (isCmsPage) {
                vm.columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else  if (vm.activity.map) {
                vm.columnSizes = {
                    left: 0,
                    middle: 12,
                    right: 0
                };
            }
            if (
                state.ui.page === PAGES.KAART_DETAIL ||
                state.ui.page === PAGES.KAART_PANORAMA ||
                state.ui.page === PAGES.KAART_ADRESSSEN ||
                state.ui.page === PAGES.KAART_SEARCH
                ) {
                vm.columnSizes = {
                    left: 0,
                    middle: 4,
                    right: 8
                };
            } else if (vm.activity.dataSelection) {
                vm.columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (vm.activity.searchResults) {
                vm.columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            }

            if(state.ui.page === PAGES.DATASETS_DETAIL) {
                vm.columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            }

            //
            // Previous logic
            //
            vm.hasMaxWidth = vm.visibility.page;
            // vm.isHomePageActive = state.page && state.page.name === 'home';

            vm.headerSize = vm.isHomePage ? HEADER.SIZE.TALL : HEADER.SIZE.SHORT;
            vm.pageType = state.page && state.page.type ? state.page.type : '';

            vm.isPrintMode = state.ui.isPrintMode;
            vm.isEmbedPreview = state.ui.isEmbedPreview;
            vm.isEmbed = state.ui.isEmbed;
            vm.isPrintOrEmbedOrPreview = dashboardColumns.isPrintOrEmbedOrPreview(state);

            vm.dataSelectionState = state.dataSelection; // TODO remove? Seems useless

            vm.isRightColumnScrollable =
                vm.visibility.page ||
                vm.visibility.detail ||
                vm.visibility.searchResults ||
                vm.visibility.dataSelection;

            // vm.columnSizes = dashboardColumns.determineColumnSizes(state);

            vm.isFullHeight = !vm.isRightColumnScrollable || vm.columnSizes.right < 12;

            vm.isMapFullscreen = Boolean(vm.visibility.map && state.ui.isMapFullscreen);
            vm.isStraatbeeldActive = Boolean(state.straatbeeld);
            vm.straatbeeldHistory = vm.isStraatbeeldActive ? state.straatbeeld.history : null;
            vm.geosearchLocation = state.search && state.search.location && state.search.location.toString();
            vm.detailEndpoint = state.detail && state.detail.endpoint; // TODO remove? Seems useless
        }
    }
})();
