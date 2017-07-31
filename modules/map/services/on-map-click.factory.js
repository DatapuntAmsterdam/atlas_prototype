((() => {
    'use strict';

    angular
        .module('dpMap')
        .factory('onMapClick', onMapClickFactory);

    onMapClickFactory.$inject = ['$rootScope', 'store', 'ACTIONS', 'drawTool', 'suppress'];

    function onMapClickFactory ($rootScope, store, ACTIONS, drawTool, suppress) {
        return {
            initialize
        };

        function initialize (leafletMap) {
            leafletMap.on('click', onMapClick);
        }

        function onMapClick (event) {
            const state = store.getState();

            if (!(suppress.isBusy() || state.atlas.isEmbedPreview || state.atlas.isEmbed || drawTool.isEnabled())) {
                $rootScope.$applyAsync(() => {
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
}))();
