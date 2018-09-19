import { radiansToDegrees } from '../../../../src/shared/services/angle-conversion/angle-conversion';
import ACTIONS from '../../../../src/shared/actions';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpHotspot', {
            bindings: {
                sceneId: '=',
                distance: '=',
                pitch: '=',
                year: '='
            },
            templateUrl: 'modules/straatbeeld/components/hotspot/hotspot.html',
            controller: DpHotspotController,
            controllerAs: 'vm'
        });

    DpHotspotController.$inject = ['store', 'STRAATBEELD_CONFIG'];

    function DpHotspotController (store, STRAATBEELD_CONFIG) {
        var vm = this,
            realLifeHotspotSize = 0.6,
            minDistance = 4,
            maxDistance = 21,
            correctedDistance,
            viewAngle,
            viewport = 960;

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
        // offset is a value between 7 and 10 degrees depending on the distance. it is subtracted from the angle of the
        // hotspot x rotation to render hotspots better that are far away
        const offset = 5 / (maxDistance - correctedDistance + 1) + 8;
        const angle = 90 - radiansToDegrees(vm.pitch) - offset;

        vm.size = Math.round(radiansToDegrees(viewAngle) * viewport / STRAATBEELD_CONFIG.DEFAULT_FOV);
        vm.transform = 'rotateX(' + angle + 'deg)';

        vm.loadScene = function () {
            store.dispatch({
                type: ACTIONS.FETCH_STRAATBEELD_BY_HOTSPOT,
                payload: {
                    id: vm.sceneId,
                    isInitial: false
                }
            });
        };
    }
})();
