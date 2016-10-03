(function () {
    'use strict';

    angular
        .module('dpPanorama')
        .component('dpHotspot', {
            bindings: {
                sceneId: '=',
                distance: '='
            },
            templateUrl: 'modules/panorama/components/hotspot/hotspot.html',
            controller: DpHotspotController,
            controllerAs: 'vm'
        });

    DpHotspotController.$inject = ['store', 'ACTIONS'];

    
    function DpHotspotController (store, ACTIONS) {
        var vm = this,
            minimumSize = 30,
            maximumSize = 80,
            maxdistance = 11;

        var stepSize = (maximumSize - minimumSize) / maxdistance;
        var hotspotSize = Math.round(maximumSize - stepSize * vm.distance);

        vm.size = Math.max(hotspotSize, minimumSize);
        
        vm.loadScene = function () {
 
            store.dispatch({
                type: ACTIONS.FETCH_PANORAMA,
                payload: { id: vm.sceneId, isInitial: false }
            });
        };
    }
})();
