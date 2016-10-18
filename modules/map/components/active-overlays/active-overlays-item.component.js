(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpActiveOverlaysItem', {
            bindings: {
                overlay: '@',
                isVisible: '=',
                zoom: '='
            },
            templateUrl: 'modules/map/components/active-overlays/active-overlays-item.html',
            controller: DpActiveOverlaysItemController,
            controllerAs: 'vm'
        });

    DpActiveOverlaysItemController.$inject = ['$scope', 'mapConfig', 'OVERLAYS'];

    function DpActiveOverlaysItemController ($scope, mapConfig, OVERLAYS) {
        var vm = this;

        vm.overlayLabel = OVERLAYS.SOURCES[vm.overlay].label_short;
        vm.hasLegend = angular.isString(OVERLAYS.SOURCES[vm.overlay].legend);

        $scope.$watchCollection(function () {
            return [vm.isVisible, vm.zoom];
        }, updateVisibility);

        function updateVisibility () {
            vm.isOverlayVisible = vm.isVisible && isVisibleAtCurrentZoom(vm.overlay, vm.zoom);

            if (vm.hasLegend) {
                vm.legendImageSrc = getLegendImageSrc(vm.overlay);
            }

            if (vm.isVisible && !isVisibleAtCurrentZoom(vm.overlay, vm.zoom)) {
                vm.overlayMessage = 'Zichtbaar bij verder zoomen';
            } else if (vm.isOverlayVisible && !vm.hasLegend) {
                vm.overlayMessage = '(geen legenda)';
            } else {
                vm.overlayMessage = null;
            }
        }

        function getLegendImageSrc (overlay) {
            var url = '';

            if (!OVERLAYS.SOURCES[overlay].external) {
                url += mapConfig.OVERLAY_ROOT;
            }

            url += OVERLAYS.SOURCES[overlay].legend;

            return url;
        }

        function isVisibleAtCurrentZoom (overlay, zoom) {
            return zoom >= OVERLAYS.SOURCES[overlay].minZoom && zoom <= OVERLAYS.SOURCES[overlay].maxZoom;
        }
    }
})();
