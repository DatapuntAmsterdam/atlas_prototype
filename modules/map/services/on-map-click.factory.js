import { isBusy } from '../../../src/map/services/suppress/suppress';
import { isEnabled } from '../../../src/map/services/draw-tool/draw-tool';

(() => {
    'use strict';

    angular
        .module('dpMap')
        .factory('onMapClick', onMapClickFactory);

    onMapClickFactory.$inject = ['$rootScope', 'store', 'ACTIONS', 'activeOverlays', '$window',
        'nearestDetail'];

    function onMapClickFactory ($rootScope, store, ACTIONS, activeOverlays, $window,
                                nearestDetail) {
        let location = [];

        return {
            initialize
        };

        function initialize (leafletMap) {
            leafletMap.on('click', onMapClick);
        }

        function onMapClick (event) {
            const visibleOverlays = activeOverlays.getVisibleOverlays(),
                state = store.getState();

            location = [event.latlng.lat, event.latlng.lng];

            if (!(isBusy() || state.ui.isEmbedPreview || state.ui.isEmbed ||
                isEnabled())) {
                store.dispatch({
                    type: ACTIONS.SET_MAP_CLICK_LOCATION.id,
                    location: {
                        latitude: location[0],
                        longitude: location[1]
                    }
                });

                if (!state.straatbeeld && visibleOverlays.length > 0) {
                    // do geosearch for nearest item in overlays
                    // if it exists go to detail of that item
                    nearestDetail.search(location, visibleOverlays, state.map.zoom, dispatchClick, state.user);
                } else {
                    $rootScope.$applyAsync(function () {
                        // old geosearch
                        dispatchClick();
                    });
                }
            }
        }

        function dispatchClick () {
            store.dispatch({
                type: ACTIONS.MAP_CLICK,
                payload: location
            });
        }
    }
})();
