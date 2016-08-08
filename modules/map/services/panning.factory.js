(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('panning', panningFactory);

    panningFactory.$inject = ['$rootScope', 'store', 'ACTIONS'];

    function panningFactory ($rootScope, store, ACTIONS) {
        return {
            initialize: initialize,
            panTo: panTo,
            getCurrentLocation: getCurrentLocation
        };

        function initialize (leafletMap) {
            leafletMap.on('dragend', function () {
                $rootScope.$applyAsync(function () {
                    store.dispatch({
                        type: ACTIONS.MAP_PAN,
                        payload: getCurrentLocation(leafletMap)
                    });
                });
            });
        }

        function panTo (leafletMap, location) {
            //Prevent infinite loop; the 'moveend' event triggers panTo, and panning always triggers a 'moveend' event.
            if (!angular.equals(location, getCurrentLocation(leafletMap))) {
                leafletMap.panTo(location);
            }
        }

        function getCurrentLocation (leafletMap) {
            var center = leafletMap.getCenter();

            return [center.lat, center.lng];
        }
    }
})();