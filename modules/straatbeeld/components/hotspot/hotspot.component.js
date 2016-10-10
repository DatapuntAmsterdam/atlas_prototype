(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpHotspot', {
            bindings: {
                sceneId: '=',
                distance: '='
            },
            templateUrl: 'modules/straatbeeld/components/hotspot/hotspot.html',
            controller: DpHotspotController,
            controllerAs: 'vm'
        });

    DpHotspotController.$inject = ['store', 'ACTIONS'];

    function DpHotspotController (store, ACTIONS) {
        var vm = this,
            minimumSize = 30,
            maximumSize = 60;

        vm.size = Math.max(Math.round(maximumSize - vm.distance), minimumSize);
        console.log('in controller');
        vm.loadScene = function () {
            console.log('loadscene');
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD,
                payload: vm.sceneId
            });
        };
    }
})();
