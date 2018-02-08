import {
    initialize,
    setZoom
} from '../../../src/map/services/zoomControls';

/* istanbul ignore next */
(function () {
    angular
        .module('dpMap')
        .factory('zoom', zoomFactory);

    zoomFactory.$inject = ['$rootScope', 'store', 'ACTIONS', 'mapConfig'];

    function zoomFactory ($rootScope, store, ACTIONS, mapConfig) {
        return {
            initialize: (leafletMap) => initialize(store, mapConfig, leafletMap),
            setZoom
        };
    }
})();
