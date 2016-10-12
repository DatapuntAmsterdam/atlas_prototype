(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpToggleLayerSelection', {
            bindings: {
                overlays: '=',
                showLayerSelection: '='
            },
            templateUrl: 'modules/map/components/toggle-layer-selection/toggle-layer-selection.html',
            controller: DpToggleLayerSelectionController,
            controllerAs: 'vm'
        });

    DpToggleLayerSelectionController.$inject = ['$scope', 'store', 'ACTIONS'];

    function DpToggleLayerSelectionController ($scope, store, ACTIONS) {
        var vm = this;

        $scope.$watch('vm.showLayerSelection', function () {
            if (!vm.showLayerSelection) {
                vm.buttonTitle = 'Kaartlagen selecteren';
            } else {
                vm.buttonTitle = 'Sluit paneel voor selecteren kaartlagen';
            }
        });

        vm.toggle = function () {
            store.dispatch({
                type: ACTIONS[vm.showLayerSelection ? 'HIDE_LAYER_SELECTION' : 'SHOW_LAYER_SELECTION']
            });
        };
    }
})();
