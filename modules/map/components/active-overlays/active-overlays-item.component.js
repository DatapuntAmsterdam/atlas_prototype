((() => {
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

    DpActiveOverlaysItemController.$inject = ['$scope', '$q', 'api', 'mapConfig', 'overlays'];

    function DpActiveOverlaysItemController ($scope, $q, api, mapConfig, overlays) {
        var vm = this;

        vm.overlayLabel = overlays.SOURCES[vm.overlay].label_short;
        vm.hasLegend = angular.isString(overlays.SOURCES[vm.overlay].legend);

        $scope.$watchCollection(() => [vm.isVisible, vm.zoom], updateVisibility);

        function updateVisibility () {
            vm.isOverlayVisible = vm.isVisible && isVisibleAtCurrentZoom(vm.overlay, vm.zoom);

            if (vm.hasLegend) {
                getLegendImageSrc(vm.overlay).then(src => {
                    vm.legendImageSrc = src;
                });
            }

            if (vm.isVisible && !isVisibleAtCurrentZoom(vm.overlay, vm.zoom)) {
                vm.overlayMessage = 'Zichtbaar bij verder zoomen';
            } else if (vm.isOverlayVisible && !vm.hasLegend) {
                vm.overlayMessage = '(geen legenda)';
            } else {
                vm.overlayMessage = null;
            }
        }

        /**
         * Returns a promise to the url of the legend image. The access token
         * will be added to the URL, unless it is an external URL.
         *
         * @param {Object} overlay The overlay ID to get the legend URL for.
         * @return {Promise} The URL of the legend image.
         */
        function getLegendImageSrc (overlay) {
            const overlayData = overlays.SOURCES[overlay],
                root = overlayData.external ? '' : mapConfig.OVERLAY_ROOT,
                url = root + overlayData.legend;

            return overlayData.external ? $q.resolve(url) : api.createUrlWithToken(url);
        }

        function isVisibleAtCurrentZoom (overlay, zoom) {
            return zoom >= overlays.SOURCES[overlay].minZoom && zoom <= overlays.SOURCES[overlay].maxZoom;
        }
    }
}))();
