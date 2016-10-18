(function () {
    'use strict';

    angular
        .module('dpMap')
        .factory('searchByClick', searchByClickFactory);

    searchByClickFactory.$inject = ['$rootScope', 'store', 'ACTIONS'];

    function searchByClickFactory ($rootScope, store, ACTIONS) {
        return {
            initialize: initialize
        };

        function initialize (leafletMap) {
            leafletMap.on('click', searchByClick);
        }

        function searchByClick (event) {
            $rootScope.$applyAsync(function () {
                store.dispatch({
                    type: ACTIONS.FETCH_SEARCH_RESULTS_BY_CLICK,
                    payload: [
                        event.latlng.lat,
                        event.latlng.lng
                    ]
                });
            });
        }
    }
})();
