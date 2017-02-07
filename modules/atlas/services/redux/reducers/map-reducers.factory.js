(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('mapReducers', mapReducersFactory);

    mapReducersFactory.$inject = ['ACTIONS'];

    function mapReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.MAP_SET_BASELAYER.id] = mapSetBaselayerReducer;
        reducers[ACTIONS.MAP_ADD_OVERLAY.id] = mapAddOverlayReducer;
        reducers[ACTIONS.MAP_REMOVE_OVERLAY.id] = mapRemoveOverlayReducer;
        reducers[ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY.id] = mapToggleVisibilityOverlay;
        reducers[ACTIONS.MAP_PAN.id] = mapPanReducer;
        reducers[ACTIONS.MAP_ZOOM.id] = mapZoomReducer;
        reducers[ACTIONS.MAP_FULLSCREEN.id] = mapFullscreenReducer;
        reducers[ACTIONS.MAP_START_DRAWING.id] = mapStartDrawingReducer;
        reducers[ACTIONS.MAP_CLEAR_DRAWING.id] = mapClearDrawingReducer;
        reducers[ACTIONS.MAP_END_DRAWING.id] = mapEndDrawingReducer;
        reducers[ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS.id] = showActiveOverlaysReducer;
        reducers[ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS.id] = hideActiveOverlaysReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the baseLayer, it should match a key from base-layers.constant.js
         *
         * @returns {Object} newState
         */
        function mapSetBaselayerReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.baseLayer = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the overlay, it should match a key from overlays.constant.js
         *
         * @returns {Object} newState
         */
        function mapAddOverlayReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (newState.map.overlays.length === 0) {
                newState.map.showActiveOverlays = true;
            }

            newState.map.overlays.push({id: payload, isVisible: true});

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the overlay, it should match a key from overlays.constant.js
         *
         * @returns {Object} newState
         */
        function mapRemoveOverlayReducer (oldState, payload) {
            var newState = angular.copy(oldState),
                i;
            // finding the id of the payload
            for (i = 0; i < newState.map.overlays.length; i++) {
                if (newState.map.overlays[i].id === payload) {
                    break;
                }
            }
            newState.map.overlays.splice(i, 1);

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the overlay, it should match a key from overlays.constant.js
         *
         * @returns {Object} newState
         */
        function mapToggleVisibilityOverlay (oldState, payload) {
            var newState = angular.copy(oldState);
            // Looking for the overlay to switch its isVisible
            for (var i = 0; i < newState.map.overlays.length; i++) {
                if (newState.map.overlays[i].id === payload) {
                    newState.map.overlays[i].isVisible = !newState.map.overlays[i].isVisible;
                    break;
                }
            }
            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - The new position in Array format, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function mapPanReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.viewCenter = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - The zoom level
         *
         * @returns {Object} newState
         */
        function mapZoomReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isArray(payload.viewCenter)) {
                newState.map.viewCenter = payload.viewCenter;
            }

            newState.map.zoom = payload.zoom;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - Boolean that defines whether or not fullscreen mode is enabled
         *
         * @returns {Object} newState
         */
        function mapFullscreenReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (payload) {
                // Set map to full screen
                newState.layerSelection.isEnabled = false;
            }

            newState.map.isFullscreen = payload;

            return newState;
        }

        function mapStartDrawingReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.drawingMode = payload.drawingMode || null;

            return newState;
        }

        function mapClearDrawingReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.geometry = [];

            return newState;
        }

        function mapEndDrawingReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.drawingMode = null;

            if (payload.geometryFilter.length > 2) {
                if (newState.dataSelection) {
                    // Nothing yet
                } else {
                    newState.dataSelection = {};
                    newState.dataSelection.dataset = 'bag';
                    newState.dataSelection.filters = {};
                }
                newState.dataSelection.geometryFilter = payload.geometryFilter;
                newState.dataSelection.geometryFilterDescription = payload.geometryFilterDescription;
                newState.dataSelection.page = 1;
                newState.dataSelection.isFullscreen = false;
                newState.dataSelection.isLoading = true;
                newState.dataSelection.view = 'LIST';
                newState.dataSelection.markers = [];

                newState.map.geometry = [];
            } else if (payload.geometryFilter.length === 2) {
                newState.map.geometry = payload.geometryFilter;
            } else {
                newState.dataSelection = null;
                newState.map.geometry = [];
            }

            return newState;
        }

        function showActiveOverlaysReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showActiveOverlays = true;

            return newState;
        }

        function hideActiveOverlaysReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showActiveOverlays = false;

            return newState;
        }
    }
})();
