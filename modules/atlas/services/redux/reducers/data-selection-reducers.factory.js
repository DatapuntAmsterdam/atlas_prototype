(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dataSelectionReducers', dataSelectionReducersFactory);

    dataSelectionReducersFactory.$inject = ['ACTIONS', 'DEFAULT_STATE', 'dataSelectionFilterNames'];

    function dataSelectionReducersFactory (ACTIONS, DEFAULT_STATE, filterNames) {
        var reducers = {};

        reducers[ACTIONS.SHOW_DATA_SELECTION.id] = showDataSelectionReducer;
        reducers[ACTIONS.SHOW_SELECTION_LIST.id] = showSelectionListReducer;
        reducers[ACTIONS.NAVIGATE_DATA_SELECTION.id] = navigateDataSelectionReducer;
        reducers[ACTIONS.TOGGLE_DATA_SELECTION_LIST_VIEW.id] = toggleDataSelectionListViewReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {Object} payload - On object with two keys: dataset (String) and filters (Object)
         *
         * @returns {Object} newState
         */
        function showDataSelectionReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map.viewCenter = DEFAULT_STATE.map.viewCenter;
            newState.map.zoom = DEFAULT_STATE.map.zoom;
            newState.map.isFullscreen = false;
            newState.map.isLoading = false;

            newState.layerSelection = false;
            newState.search = null;
            newState.page = null;
            newState.detail = null;
            newState.straatbeeld = null;

            newState.dataSelection = payload;

            return newState;
        }

        function showSelectionListReducer (oldState, payload) {
            const filters = Object.keys(payload).reduce(
                (result, key) => angular.extend(result, {
                    [filterNames.getSlugFor(key)]: payload[key]
                }), {});

            let newState = showDataSelectionReducer(
                oldState, {
                    dataset: 'bag',
                    filters: filters,
                    page: 1
                });

            return toggleDataSelectionListViewReducer(newState);
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - The destination page
         *
         * @returns {Object} newState
         */
        function navigateDataSelectionReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.dataSelection.page = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function toggleDataSelectionListViewReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.dataSelection.listView = !newState.dataSelection.listView;

            return newState;
        }
    }
})();
