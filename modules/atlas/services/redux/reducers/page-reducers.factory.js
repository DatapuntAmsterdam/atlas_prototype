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
            newState.search = null;
            newState.detail = null;
            newState.straatbeeld = null;
            newState.dataSelection = null;
            newState.stackedPanels.length = 0;

            return newState;
        }
    }
})();

