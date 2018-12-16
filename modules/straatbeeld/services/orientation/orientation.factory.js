import { radiansToDegrees } from '../../../../src/shared/services/angle-conversion/angle-conversion';
import { setPanoramaOrientation } from '../../../../src/panorama/ducks/panorama';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('orientation', orientationFactory);

    orientationFactory.$inject = ['store'];

    function orientationFactory (store) {
        return {
            update: update
        };

        function update (viewer) {
            const heading = radiansToDegrees(viewer.view().yaw());
            const pitch = radiansToDegrees(viewer.view().pitch());
            const fov = radiansToDegrees(viewer.view().fov());

            store.dispatch(setPanoramaOrientation({
                heading,
                pitch,
                fov
            }));
        }
    }
})();
