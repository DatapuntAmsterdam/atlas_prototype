(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('searchReducers', searchReducersFactory);

    searchReducersFactory.$inject = ['ACTIONS'];

    function searchReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY.id] = fetchSearchResultsByQueryReducer;
        reducers[ACTIONS.FETCH_SEARCH_RESULTS_BY_LOCATION.id] = fetchSearchResultsByLocationReducer;
        reducers[ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY.id] = fetchSearchResultsCategoryReducer;
        reducers[ACTIONS.SHOW_SEARCH_RESULTS.id] = showSearchResultsReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {String} payload - A search query
         *
         * @returns {Object} newState
         */
        function fetchSearchResultsByQueryReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.search = {
                isLoading: true,
                query: payload,
                location: null,
                category: null,
                numberOfResults: null
            };

            newState.map.isFullscreen = false;

            newState.layerSelection.isEnabled = false;
            newState.page.name = null;
            newState.detail = null;
            newState.straatbeeld = null;
            newState.dataSelection = null;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Array} payload - A location, e.g. [52.123, 4.789]
         *
         * @returns {Object} newState
         */
        function fetchSearchResultsByLocationReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.search = {
                isLoading: true,
                query: null,
                location: payload,
                category: null,
                numberOfResults: null
            };

            if (oldState.layerSelection.isEnabled || (oldState.map && oldState.map.isFullscreen)) {
                newState.map.viewCenter = payload;
            }

            newState.layerSelection.isEnabled = false;
            if (newState.map) {
                newState.map.showActiveOverlays = false;
                newState.map.isFullscreen = false;
            }
            newState.page.name = null;
            newState.detail = null;
            newState.straatbeeld = null;
            newState.dataSelection = null;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - A reference to the slug of a SEARCH_CONFIG endpoint
         *
         * @returns {Object} newState
         */
        function fetchSearchResultsCategoryReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isObject(newState.search)) {
                newState.search.isLoading = true;
                newState.search.category = payload;
                newState.search.numberOfResults = null;
            }

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload - The number of search results
         *
         * @returns {Object} newState
         */
        function showSearchResultsReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            if (angular.isObject(newState.search)) {
                newState.search.isLoading = false;
                newState.search.numberOfResults = payload;
            }

            return newState;
        }
    }
})();

