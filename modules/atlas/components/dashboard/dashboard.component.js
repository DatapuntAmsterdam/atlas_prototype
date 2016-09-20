(function () {
    'use strict';

    angular
        .module('atlas')
        .component('atlasDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: AtlasDashboardController,
            controllerAs: 'vm'
        });

    AtlasDashboardController.$inject = ['store', 'dashboardColumns'];

    function AtlasDashboardController (store, dashboardColumns) {
        var vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        function setLayout () {
            var state = store.getState();

            vm.visibility = dashboardColumns.determineVisibility(state);

            vm.isPrintMode = state.isPrintMode;
            vm.isMapFullscreen = state.stackedPanels[state.stackedPanels.length - 1] === 'fullscreen';

            vm.isRightColumnScrollable = !vm.isMapFullscreen &&
                (
                    vm.visibility.page ||
                    vm.visibility.detail ||
                    vm.visibility.searchResults ||
                    vm.visibility.dataSelection
                );

            vm.columnSizes = dashboardColumns.determineColumnSizes(
                vm.visibility,
                vm.isMapFullscreen,
                vm.isPrintMode
            );
        }
    }
})();