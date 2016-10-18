/**
 * @ngdoc directive
 * @name atlas.component:atlasDashboard
 * @description
 * A description
*/

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
        var vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        function setLayout () {
            var state = store.getState();

            vm.visibility = dashboardColumns.determineVisibility(state);

            vm.isPrintMode = state.isPrintMode;

            vm.isRightColumnScrollable = !state.map.isFullscreen &&
                (
                    vm.visibility.page ||
                    vm.visibility.detail ||
                    vm.visibility.searchResults ||
                    vm.visibility.dataSelection
                );

            vm.columnSizes = dashboardColumns.determineColumnSizes(
                vm.visibility,
                state.map.isFullscreen,
                vm.isPrintMode
            );

            // Needed for the dp-scrollable-content directive
            vm.pageName = state.page;
        }
    }
})();
