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

        $scope.$watch('vm.showLayerSelection', () => setStatus());

        setStatus();

        function setStatus () {
            if (vm.showLayerSelection) {
                vm.buttonTitle = 'Sluit paneel voor selecteren kaartlagen';
                vm.action = 'HIDE_LAYER_SELECTION';
            } else {
                vm.buttonTitle = 'Kaartlagen selecteren';
                vm.action = 'SHOW_LAYER_SELECTION';
            }
        }
    }
})();
