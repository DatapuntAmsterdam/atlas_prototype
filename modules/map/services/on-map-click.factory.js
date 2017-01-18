(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('onMapClick', onMapClickFactory);

    onMapClickFactory.$inject = ['$rootScope', 'store', 'ACTIONS'];

    function onMapClickFactory ($rootScope, store, ACTIONS) {
        let enabled = true;

        return {
            initialize
        };

        function initialize (leafletMap) {
            leafletMap.on('click', onMapClick);

            store.subscribe(() => {
                if (store.getState().map.drawingMode === 'DRAW') {
                    disable();
                } else {
                    enable();
                }
            });
        }

        function disable () {
            enabled = false;
        }

        function enable () {
            enabled = true;
        }

        function onMapClick (event) {
            if (enabled) {
                $rootScope.$applyAsync(function () {
                    store.dispatch({
                        type: ACTIONS.MAP_CLICK,
                        payload: [
                            event.latlng.lat,
                            event.latlng.lng
                        ]
                    });
                });
            }
        }
    }
})();
