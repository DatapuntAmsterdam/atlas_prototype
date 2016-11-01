(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('straatbeeldReducers', straatbeeldReducersFactory);

    straatbeeldReducersFactory.$inject = ['ACTIONS'];

    function straatbeeldReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.FETCH_STRAATBEELD] = fetchStraatbeeldReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_INITIAL] = showStraatbeeldReducer;
        reducers[ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT] = showStraatbeeldReducer;
        reducers[ACTIONS.STRAATBEELD_SET_ORIENTATION] = setOrientationReducer;

        return reducers;

        /**
         * @description If the oldState had an active panorama it will remember the heading, pitch and fov. Otherwise
         * it'll use the car's orientation for the heading and pitch and a default FOV.
         *
         * @param {Object} oldState
         * @param {Number|Array} payload - A panorama ID (Number) or a location (Array)
         *
         * @returns {Object} newState
         */
        function fetchStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (newState.straatbeeld === null) {
                newState.straatbeeld = {};
            }

            if (angular.isNumber(payload)) {
                newState.straatbeeld.id = payload;
                newState.straatbeeld.searchLocation = null;
            } else {
                newState.straatbeeld.id = null;
                newState.straatbeeld.searchLocation = payload;
            }

            newState.straatbeeld.date = null;
            newState.straatbeeld.car = null;
            newState.straatbeeld.camera = oldState.straatbeeld && oldState.straatbeeld.camera || null;
            newState.straatbeeld.hotspots = [];
            newState.straatbeeld.isLoading = true;

            newState.map.isLoading = true;
            newState.search = null;
            newState.page = null;
            newState.detail = null;
            newState.dataSelection = null;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - formatted data from Earthmine
         *
         * @returns {Object} newState
         */
        function showStraatbeeldReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            // Straatbeeld can be null if another action gets triggered between FETCH_STRAATBEELD and SHOW_STRAATBEELD
            if (angular.isObject(newState.straatbeeld)) {
                newState.straatbeeld.id = payload.id;
                newState.straatbeeld.searchLocation = null;
                newState.straatbeeld.date = payload.date;
                newState.straatbeeld.car = payload.car;
                newState.straatbeeld.hotspots = payload.hotspots;
                newState.straatbeeld.isLoading = false;

                if (oldState.straatbeeld.camera === null) {
                    newState.straatbeeld.camera = {
                        heading: newState.straatbeeld.car.heading,
                        pitch: newState.straatbeeld.car.pitch
                    };
                }

                newState.map.isLoading = false;
            }

            return newState;
        }

        function setOrientationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.straatbeeld.camera = payload;

            return newState;
        }
    }
})();
