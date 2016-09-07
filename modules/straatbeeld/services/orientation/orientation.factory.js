(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('orientation', orientationFactory);

    orientationFactory.$inject = ['store', 'ACTIONS'];

    function orientationFactory (store, ACTIONS) {
        return {
            update: update
        };

        function update (viewer, straatbeeld) {
            var cameraHeading,
                cameraYaw,
                cameraPitch,
                cameraFov;

            cameraYaw = viewer.view().yaw();
            cameraPitch = viewer.view().pitch();
            cameraFov = viewer.view().fov();

            cameraHeading = straatbeeld.heading + cameraYaw;
             
            store.dispatch({
                type: ACTIONS.STRAATBEELD_SET_ORIENTATION,
                payload: {
                    heading: cameraHeading,
                    pitch: cameraPitch,
                    fov: cameraFov
                }
            });
        }
    }
})();