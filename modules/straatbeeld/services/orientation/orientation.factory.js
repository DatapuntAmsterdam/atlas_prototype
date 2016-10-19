(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .factory('orientation', orientationFactory);

    orientationFactory.$inject = ['store', 'ACTIONS', 'angleConversion'];

    function orientationFactory (store, ACTIONS, angleConversion) {
        return {
            update: update
        };

        function update (viewer) {
            var pitch,
                fov,
                heading;

            pitch = angleConversion.radiansToDegrees(viewer.view().pitch());
            fov = angleConversion.radiansToDegrees(viewer.view().fov());
            heading = angleConversion.radiansToDegrees(viewer.view().yaw());

            store.dispatch({
                type: ACTIONS.SET_STRAATBEELD_ORIENTATION,
                payload: {
                    heading: heading,
                    pitch: pitch,
                    fov: fov
                }
            });
        }
    }
})();
