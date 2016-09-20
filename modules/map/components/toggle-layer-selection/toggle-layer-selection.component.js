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

    DpToggleLayerSelectionController.$inject = ['store', 'ACTIONS'];

    function DpToggleLayerSelectionController (store, ACTIONS) {
        var vm = this;

        vm.toggle = function () {
            store.dispatch({
                type: ACTIONS[
                    vm.showLayerSelection ?
                        'STACKED_PANELS_HIDE_LAYER_SELECTION' :
                        'STACKED_PANELS_SHOW_LAYER_SELECTION'
                    ]
            });
        };
    }
})();