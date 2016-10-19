(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('straatbeeldReducers', straatbeeldReducersFactory);

    straatbeeldReducersFactory.$inject = ['ACTIONS', 'straatbeeldConfig'];

    function straatbeeldReducersFactory (ACTIONS, straatbeeldConfig) {
        var reducers = {};

        reducers[ACTIONS.FETCH_STRAATBEELD] = fetchStraatbeeldReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_INITIAL] = showStraatbeeldReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT] = showStraatbeeldReducer;
        reducers[ACTIONS.SET_STRAATBEELD_ORIENTATION] = setOrientationReducer;

        return reducers;

        /**
         * @description If the oldState had an active straatbeeld it will remember the heading.
         *
         * @param {Object} oldState
         * @param {Object} payload - A straatbeeld ID (String)
         *
         * @returns {Object} newState
         */
        function fetchStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld = newState.straatbeeld || {};
            newState.straatbeeld.id = payload.id;
            newState.straatbeeld.heading = payload.heading || oldState.straatbeeld.heading;
            newState.straatbeeld.isInitial = payload.isInitial;
            newState.straatbeeld.date = null;
            newState.straatbeeld.hotspots = [];
            newState.straatbeeld.isLoading = true;
            newState.straatbeeld.location = null;

            newState.straatbeeld.pitch = null;
            newState.straatbeeld.fov = null;
            newState.straatbeeld.image = null;
            newState.map.highlight = null;

            newState.search = null;
            newState.page = null;
            newState.detail = null;

            newState.dataSelection = null;

            newState.map.isLoading = true;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Object} payload -  data from straatbeeld-api
         *
         * @returns {Object} newState
         */
        function showStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            // Straatbeeld can be null if another action gets triggered between FETCH_STRAATBEELD and SHOW_STRAATBEELD
            if (angular.isObject(newState.straatbeeld)) {
                newState.straatbeeld.date = payload.date;

                newState.straatbeeld.pitch = oldState.straatbeeld.pitch || 0;
                newState.straatbeeld.fov = oldState.straatbeeld.fov || straatbeeldConfig.DEFAULT_FOV;

                newState.straatbeeld.hotspots = payload.hotspots;
                newState.straatbeeld.isLoading = false;
                newState.straatbeeld.location = payload.location;
                newState.straatbeeld.image = payload.image;
                newState.map.isLoading = false;
            }

            return newState;
        }

        function setOrientationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld.heading = payload.heading;
            newState.straatbeeld.pitch = payload.pitch;
            newState.straatbeeld.fov = payload.fov;

            return newState;
        }
    }
})();
