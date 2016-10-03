(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('panoramaReducers', panoramaReducersFactory);

    panoramaReducersFactory.$inject = ['ACTIONS', 'panoramaConfig'];

    function panoramaReducersFactory (ACTIONS, panoramaConfig) {
        var reducers = {};

        reducers[ACTIONS.FETCH_PANORAMA] = fetchPanoramaReducer;
        reducers[ACTIONS.SHOW_PANORAMA_INITIAL] = showPanoramaReducer;
        reducers[ACTIONS.SHOW_PANORAMA_SUBSEQUENT] = showPanoramaReducer;
        reducers[ACTIONS.PANORAMA_SET_ORIENTATION] = setOrientationReducer;

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
        function fetchPanoramaReducer (oldState, payload) {
            
            var newState = angular.copy(oldState);

            newState.panorama = newState.panorama || {};
            newState.panorama.id = payload.id;
            newState.panorama.heading = payload.heading || oldState.panorama.heading;
            newState.panorama.isInitial = payload.isInitial;
            newState.panorama.date = null;
            newState.panorama.hotspots = [];
            newState.panorama.isLoading = true;
            newState.panorama.location = null;

            newState.panorama.pitch = null;
            newState.panorama.fov = null;
            
            
            newState.panorama.image = null;

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
         * @param {Array} payload - formatted data from mapApi
         *
         * @returns {Object} newState
         */
        function showPanoramaReducer (oldState, payload) {
            
            var newState = angular.copy(oldState);
            
            //Panorama can be null if another action gets triggered between FETCH_PANORAMA and SHOW_PANORAMA
            if (angular.isObject(newState.panorama)) {
                newState.panorama.date = payload.date;


                newState.panorama.heading = oldState.panorama.heading;
                
                newState.panorama.pitch = oldState.panorama.pitch || 0;
                newState.panorama.fov =  oldState.panorama.fov || panoramaConfig.DEFAULT_FOV;

                newState.panorama.hotspots = payload.hotspots;
                newState.panorama.isLoading = false;
                newState.panorama.location = payload.location;
                newState.panorama.image = payload.image;
                newState.map.isLoading = false;
            }

            return newState;
        }

        function setOrientationReducer (oldState, payload) {
            var newState = angular.copy(oldState);
             
            newState.panorama.heading = payload.heading;
            newState.panorama.pitch = payload.pitch;
            newState.panorama.fov = payload.fov;
            return newState;
        }
    }
})();
