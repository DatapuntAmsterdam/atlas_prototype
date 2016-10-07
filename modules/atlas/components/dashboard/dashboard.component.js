/**
 * @ngdoc directive
 * @name atlas.component:atlasDashboard
 * @restrict 'E'
 * @description
 * The atlas dashboard component
 */

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

    /**
     * @ngdoc controller
     * @name atlas.controller:AtlasDashboardController
     * @param {object} store The state store object
     * @param {object} dashboardColumns The dashboard column service
     * @description
     * The controller for the atlas dashboard. It is in this controller that
     * state changes are linked to visiblity and column changes in the application.
     */
    function AtlasDashboardController (store, dashboardColumns) {
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
        }
    }
})();