(function () {
    'use strict';

    angular
        .module('dpLayerSelection')
        .component('dpLayerSelection', {
            bindings: {
                activeBaseLayer: '@baseLayer',
                activeOverlays: '=overlays',
                zoom: '='
            },
            templateUrl: 'modules/layer-selection/components/layer-selection/layer-selection.html',
            controller: DpLayerSelectionController,
            controllerAs: 'vm'
        });

    DpLayerSelectionController.$inject = ['$scope', 'BASE_LAYERS', 'overlays', 'store', 'ACTIONS', 'user'];

    function DpLayerSelectionController ($scope, BASE_LAYERS, overlays, store, ACTIONS, user) {
        var vm = this;

        $scope.$watch(user.getAuthorizationLevel, onAuthorizationChange);

        vm.allBaseLayers = BASE_LAYERS;

        vm.setBaseLayer = function (baseLayer) {
            store.dispatch({
                type: ACTIONS.MAP_SET_BASELAYER,
                payload: baseLayer
            });
        };

        vm.toggleOverlay = function (overlay) {
            var action;

            if (!vm.isOverlayActive(overlay)) {
                action = ACTIONS.MAP_ADD_OVERLAY;
            } else {
                action = ACTIONS.MAP_REMOVE_OVERLAY;
            }

            store.dispatch({
                type: action,
                payload: overlay
            });
        };

        vm.isOverlayActive = function (overlay) {
            for (var i = 0; i < vm.activeOverlays.length; i++) {
                if (vm.activeOverlays[i].id === overlay) {
                    return true;
                }
            }
            return false;
        };

        vm.isOverlayVisible = function (overlay) {
            return vm.zoom >= overlays.SOURCES[overlay].minZoom &&
                vm.zoom <= overlays.SOURCES[overlay].maxZoom;
        };

        function onAuthorizationChange () {
            vm.isMoreInfoAvailable = !user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE);

            setOverlays();
        }

        function setOverlays () {
            vm.allOverlays = overlays.HIERARCHY.map(function (category) {
                var formattedOverlays = angular.copy(category);

                formattedOverlays.overlays = formattedOverlays.overlays.map(function (overlaySlug) {
                    return {
                        slug: overlaySlug,
                        label: overlays.SOURCES[overlaySlug].label_long
                    };
                });
                return formattedOverlays;
            });
        }
    }
})();
