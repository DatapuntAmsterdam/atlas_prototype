(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('pageReducers', pageReducersFactory);

    pageReducersFactory.$inject = ['ACTIONS'];

    function pageReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.SHOW_PAGE] = showPageReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {String} payload - The name of the page, it should match the name of an HTML template from the page
         * module
         *
         * @returns {Object} newState
         */
        function showPageReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.page = payload;

            newState.map.highlight = null;
            newState.map.showLayerSelection = false;
            newState.map.isFullscreen = false;
            newState.search = null;
            newState.detail = null;
            newState.panorama = null;
            newState.dataSelection = null;

            return newState;
        }
    }
})();

