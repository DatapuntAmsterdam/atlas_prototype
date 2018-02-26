(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('mapReducers', mapReducersFactory);

    mapReducersFactory.$inject = ['$rootScope', '$timeout', 'ACTIONS'];

    function mapReducersFactory ($rootScope, $timeout, ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.SHOW_MAP.id] = showMapReducer;
        reducers[ACTIONS.MAP_ADD_PANO_OVERLAY.id] = mapAddPanoOverlayReducer;
        reducers[ACTIONS.MAP_REMOVE_PANO_OVERLAY.id] = mapRemovePanoOverlayReducer;
        reducers[ACTIONS.MAP_PAN.id] = mapPanReducer;
        reducers[ACTIONS.MAP_ZOOM.id] = mapZoomReducer;
        reducers[ACTIONS.MAP_HIGHLIGHT.id] = mapHighlightReducer;

        return reducers;

        function showMapReducer (state) {
            return {
                ...state,
                ui: angular.isObject(state.ui) ? {
                    ...state.ui,
                    isMapPanelVisible: true,
                    isMapFullscreen: true
                } : state.ui
            };
        }

        /**
         * Adds a 'pano' (street view) layer according to the 'history'
         * selection in the state ('pano2016', 'pano2020', or 'pano' by default
         * for the most recent version).
         *
         * Removes any active 'pano' (street view) layer before adding the new
         * one.
         *
         * @param {Object} state
         *
         * @returns {Object} newState
         */
        function mapAddPanoOverlayReducer (state) {
            const newLayer = (state.straatbeeld && state.straatbeeld.history)
                ? `pano${state.straatbeeld.history}`
                : 'pano';

            if (state.map && state.map.overlays.filter((overlay) => overlay.id === newLayer).length === 1) {
                // Ovelay already exists
                return state;
            }

            // Remove any active 'pano' layers
            const overlays = state.map && state.map.overlays
                .filter((overlay) => !overlay.id.startsWith('pano'));

            return {
                ...state,
                map: angular.isObject(state.map) ? {
                    ...state.map,
                    overlays: [
                        ...overlays,
                        {id: newLayer, isVisible: true}
                    ]
                } : state.map
            };
        }

        /**
         * Removes any active 'pano' (street view) layer.
         *
         * @param {Object} state
         *
         * @returns {Object} newState
         */
        function mapRemovePanoOverlayReducer (state) {
            // Remove all active 'pano' layers
            const overlays = state.map && state.map.overlays
                .filter((overlay) => !overlay.id.startsWith('pano'));

            if (state.map && overlays.length === state.map.overlays.length) {
                // No 'pano' layers were active
                return state;
            }

            return {
                ...state,
                map: angular.isObject(state.map) ? {
                    ...state.map,
                    overlays
                } : state.map
            };
        }

        /**
         * @param {Object} state
         * @param {Array} payload - The new position in Array format, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function mapPanReducer (state, payload) {
            return {
                ...state,
                map: angular.isObject(state.map) ? {
                    ...state.map,
                    viewCenter: payload
                } : state.map
            };
        }

        /**
         * @param {Object} state
         * @param {Number} payload - The zoom level
         *
         * @returns {Object} newState
         */
        function mapZoomReducer (state, payload) {
            return {
                ...state,
                map: angular.isObject(state.map) ? {
                    ...state.map,
                    zoom: payload.zoom,
                    viewCenter: angular.isArray(payload.viewCenter) ? payload.viewCenter : state.map.viewCenter
                } : state.map
            };
        }

        /**
         * @param {Object} state
         * @param {Number} payload - Set hightlighting on or off
         *
         * @returns {Object} newState
         */
        function mapHighlightReducer (state, payload) {
            return {
                ...state,
                map: angular.isObject(state.map) ? {
                    ...state.map,
                    highlight: payload
                } : state.map
            };
        }
    }
})();
