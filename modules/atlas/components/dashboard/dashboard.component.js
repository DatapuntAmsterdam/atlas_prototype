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

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

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
        }
    }
})();
