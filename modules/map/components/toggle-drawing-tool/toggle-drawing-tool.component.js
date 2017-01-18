(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpToggleDrawingTool', {
            bindings: {
                enabled: '='
            },
            templateUrl: 'modules/map/components/toggle-drawing-tool/toggle-drawing-tool.html',
            controller: DpToggleDrawingToolController,
            controllerAs: 'vm'
        });

    DpToggleDrawingToolController.$inject = ['store', 'ACTIONS'];

    function DpToggleDrawingToolController (store, ACTIONS) {
        let vm = this;

        vm.toggle = () => {
            store.dispatch({
                type: ACTIONS.MAP_SET_DRAWING_MODE,
                payload: !vm.enabled
            });
        };
    }
})();
