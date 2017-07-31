((() => {
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

            setDoubleClickZoom(leafletMap);

            leafletMap.on('zoomend', () => {
                setDoubleClickZoom(leafletMap);

                $rootScope.$applyAsync(() => {
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
            leafletMap.setZoom(zoomLevel, {
                animate: false
            });
        }

        function setDoubleClickZoom (leafletMap) {
            if (leafletMap.getZoom() === mapConfig.BASE_LAYER_OPTIONS.maxZoom) {
                leafletMap.doubleClickZoom.disable();
            } else {
                leafletMap.doubleClickZoom.enable();
            }
        }
    }
}))();
