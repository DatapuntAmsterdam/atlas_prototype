((() => {
    'use strict';

    angular
        .module('atlas')
        .component('dpDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: DpDashboardController,
            controllerAs: 'vm'
        });

    DpDashboardController.$inject = ['$scope', 'store', 'ACTIONS', 'dashboardColumns', 'HEADER'];

    function DpDashboardController ($scope, store, ACTIONS, dashboardColumns, HEADER) {
        const vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        $scope.$watch(() => dashboardColumns.determineVisibility(store.getState()).httpStatus, setLayout);
        $scope.$watchGroup(['vm.isStraatbeeldActive', 'vm.straatbeeldHistory'], () => {
            if (vm.isStraatbeeldActive) {
                store.dispatch({ type: ACTIONS.MAP_ADD_PANO_OVERLAY });
            } else {
                store.dispatch({ type: ACTIONS.MAP_REMOVE_PANO_OVERLAY });
            }
        });

        function setLayout () {
            const state = store.getState();

            vm.activity = dashboardColumns.determineActivity(state);
            vm.visibility = dashboardColumns.determineVisibility(state);

            vm.hasMaxWidth = vm.visibility.page;
            vm.isHomePage = vm.visibility.page && state.page && state.page.name === 'home';
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

            vm.isStraatbeeldActive = Boolean(state.straatbeeld);
            vm.straatbeeldHistory = vm.isStraatbeeldActive ? state.straatbeeld.history : null;
        }
    }
}))();
