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

    DpHotspotController.$inject = ['store', 'ACTIONS', 'straatbeeldConfig', 'angleConversion'];

    function DpHotspotController (store, ACTIONS, straatbeeldConfig, angleConversion) {
        var vm = this,
            realLifeHotspotSize = 0.3,
            minDistance = 4,
            maxDistance = 21,
            correctedDistance,
            viewAngle,
            viewport;

        /*
        All hotspots are shown, the min- and maxDistance variables are only used to determine the minimum and maximum
        hotspot size.
        */
        correctedDistance = Math.min(maxDistance, Math.max(minDistance, vm.distance));
        viewAngle = Math.atan(realLifeHotspotSize / correctedDistance);

        /*
        The actual hotspot size is dependent on the width of the straatbeeld and the FOV. For this first version we're
        making assumptions about the viewport and FOV.
        */
        viewport = 960;
        vm.size = Math.round(angleConversion.radiansToDegrees(viewAngle) * viewport / straatbeeldConfig.DEFAULT_FOV);

        vm.loadScene = function () {
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD,
                payload: {
                    id: vm.sceneId,
                    isInitial: false
                }
            });
        };
    }
})();
