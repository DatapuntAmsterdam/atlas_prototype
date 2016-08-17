(function () {
    'use strict';

    angular
        .module('atlas')
        .component('atlasDashboard', {
            templateUrl: 'modules/atlas/components/dashboard/dashboard.html',
            controller: AtlasDashboardController,
            controllerAs: 'vm'
        });

    AtlasDashboardController.$inject = ['store'];

    function AtlasDashboardController (store) {
        var vm = this;

        vm.store = store;

        store.subscribe(setLayout);
        setLayout();

        function setLayout () {
            var state = store.getState();

            vm.panelVisibility = {
                layerSelection: state.map.showLayerSelection,
                page: !vm.showLayerSelection && angular.isString(state.page),
                detail: angular.isObject(state.detail),
                straatbeeld: angular.isObject(state.straatbeeld),
                searchResults: angular.isObject(state.search) &&
                    (angular.isString(state.search.query) || angular.isArray(state.search.location))
            };

            vm.isRightColumnScrollable = !state.map.isFullscreen &&
                (vm.panelVisibility.page || vm.panelVisibility.detail || vm.panelVisibility.searchResults);

            if (state.map.isFullscreen) {
                vm.sizeLeftColumn = 0;
                vm.sizeMiddleColumn = 12;
            } else if (vm.panelVisibility.layerSelection) {
                vm.sizeLeftColumn = 8;
                vm.sizeMiddleColumn = 4;
            } else {
                vm.sizeLeftColumn = 0;
                vm.sizeMiddleColumn = 4;
            }

            vm.sizeRightColumn = 12 - vm.sizeLeftColumn - vm.sizeMiddleColumn;
            vm.isPrintMode = state.isPrintMode;
        }
    }
})();