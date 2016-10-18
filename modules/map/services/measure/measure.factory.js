(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('measure', measureFactory);

    measureFactory.$inject = ['$rootScope', 'L', 'MEASURE_CONFIG', 'store', 'ACTIONS'];

    function measureFactory ($rootScope, L, MEASURE_CONFIG, store, ACTIONS) {
        return {
            initialize: initialize
        };

        function initialize (leafletMap) {
            var measureControl = new L.Control.Measure(MEASURE_CONFIG);

            measureControl.addTo(leafletMap);

            leafletMap.on('measurestart', function () {
                $rootScope.$applyAsync(function () {
                    store.dispatch({
                        type: ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS
                    });
                });
            });
        }
    }
})();
