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

            vm.isPrintMode = state.isPrintMode;
            vm.visibility = determineVisibility(state);
            
            vm.isRightColumnScrollable = !vm.isPrintMode && !state.map.isFullscreen &&
                (vm.visibility.page || vm.visibility.detail || vm.visibility.searchResults);

            vm.columnSizes = determineColumnSizes(vm.visibility, state.map.isFullscreen, vm.isPrintMode);
        }
        
        function determineVisibility (state) {
            return {
                layerSelection: state.map.showLayerSelection,
                page: !vm.showLayerSelection && angular.isString(state.page),
                detail: angular.isObject(state.detail),
                straatbeeld: angular.isObject(state.straatbeeld),
                searchResults: angular.isObject(state.search) &&
                    (angular.isString(state.search.query) || angular.isArray(state.search.location))
            };
        }
        
        function determineColumnSizes (visibility, hasFullscreenMap, isPrintMode) {
            var columnSizes = {};
            
            if (!isPrintMode) {
                if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                } else if (visibility.layerSelection) {
                    columnSizes.left = 8;
                    columnSizes.middle = 4;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 4;
                }

                columnSizes.right = 12 - columnSizes.left - columnSizes.middle;
            } else {
                if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 0;
                } else if (visibility.page || visibility.searchResults) {
                    columnSizes.left = 0;
                    columnSizes.middle = 0;
                    columnSizes.right = 12;
                } else if (visibility.layerSelection) {
                    columnSizes.left = 12;
                    columnSizes.middle = 0;
                    columnSizes.right = 0;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 12;
                }
            }

            return columnSizes;
        }
    }
})();