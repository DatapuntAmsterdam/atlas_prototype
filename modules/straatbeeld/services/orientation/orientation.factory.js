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

        function update (viewer, car) {
            var cameraHeading,
                cameraYaw,
                cameraPitch,
                cameraFov;

            cameraYaw = viewer.view().yaw();
            cameraPitch = viewer.view().pitch();
            cameraFov = viewer.view().fov();

            cameraHeading = car.heading + cameraYaw;

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
