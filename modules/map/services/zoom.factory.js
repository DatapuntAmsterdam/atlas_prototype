(function () {
    angular
        .module('dpMap')
        .factory('zoom', zoomFactory);

    zoomFactory.$inject = ['$rootScope', 'L', 'store', 'ACTIONS', 'mapConfig', 'panning'];

    function zoomFactory ($rootScope, L, store, ACTIONS, mapConfig, panning) {
        return {
            initialize: initialize,
            setZoom: setZoom
        };

        function initialize (leafletMap) {
            L.control.scale(mapConfig.SCALE_OPTIONS).addTo(leafletMap);
            L.control.zoom(mapConfig.ZOOM_OPTIONS).addTo(leafletMap);

            leafletMap.on('zoomend', function () {
                $rootScope.$applyAsync(function () {
                    store.dispatch({
                        type: ACTIONS.MAP_ZOOM,
                        payload: {
                            viewCenter: panning.getCurrentLocation(leafletMap),
                            zoom: leafletMap.getZoom()
                        }
                    });
                });
            });
        }

        function setZoom (leafletMap, zoomLevel) {
            leafletMap.setZoom(zoomLevel);
        }
    }
})();
