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
        reducers[ACTIONS.MAP_SET_DRAWING_MODE.id] = mapSetDrawingModeReducer;
        reducers[ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS.id] = showActiveOverlaysReducer;
        reducers[ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS.id] = hideActiveOverlaysReducer;
        reducers[ACTIONS.MAP_SET_POINTS.id] = mapSetPointsReducer;

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
                newState.layerSelection = false;
            }

            newState.map.isFullscreen = payload;

            return newState;
        }

        /**
         * Sets the mode of the drawing tool (DRAW or EDIT), or null when
         * disabled.
         *
         * Instead of a string, true can also be given to simply turn on the
         * drawing tool. The drawing tool will figure out what state to go into
         * and will update this state accordingly.
         *
         * @param {Object} oldState
         * @param {?string} payload The drawing mode, or null if the drawing
         * tool is disabled.
         *
         * @returns {Object} The new state
         */
        function mapSetDrawingModeReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.drawingMode = payload || null;

            return newState;
        }
        /**
         * @param {Object} oldState
         * @param {Number} payload - The nr of points drawn on the map
         *
         * @returns {Object} newState
         */
        function mapSetPointsReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.pointsDrawn = payload;
            console.log('in reducer', payload);
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
