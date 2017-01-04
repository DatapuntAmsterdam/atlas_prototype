(function () {
    'use strict';

    angular
        .module('atlas')
        .component('dpDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: DpDashboardController,
            controllerAs: 'vm'
        });

    DpDashboardController.$inject = ['store', 'dashboardColumns'];

    function DpDashboardController (store, dashboardColumns) {
        let vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        function setLayout () {
            const state = store.getState();

            vm.activity = dashboardColumns.determineVisibility(state);
            vm.visibility = dashboardColumns.determineVisibility(state);

            vm.isPrintMode = state.isPrintMode;

            vm.isCatalogus = (state.dataSelection && state.dataSelection.view === 'CARDS') ||
                (state.detail && state.detail.endpoint.includes('/catalogus/api/'));
            vm.dataSelectionState = state.dataSelection;

            vm.isRightColumnScrollable = !vm.isFullscreen &&
                (
                    vm.visibility.page ||
                    vm.visibility.detail ||
                    vm.visibility.searchResults ||
                    vm.visibility.dataSelection
                );

            vm.columnSizes = dashboardColumns.determineColumnSizes(
                state,
                vm.visibility,
                vm.isPrintMode
            );

            // Needed for the dp-scrollable-content directive
            vm.pageName = state.page;
        }
    }
})();
