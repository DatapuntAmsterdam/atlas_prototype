(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dataSelectionReducers', dataSelectionReducersFactory);

    dataSelectionReducersFactory.$inject = ['ACTIONS', 'DEFAULT_STATE'];

    function dataSelectionReducersFactory (ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.SHOW_DATA_SELECTION] = showDataSelectionReducer;
        reducers[ACTIONS.NAVIGATE_DATA_SELECTION] = navigateDataSelectionReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {Object} payload - On object with two keys: dataset (String) and filters (Object)
         *
         * @returns {Object} newState
         */
        function showDataSelectionReducer (oldState, payload) {
            var newState = angular.copy(oldState);

            newState.map = {
                baseLayer: oldState.map.baseLayer,
                overlays: oldState.map.overlays,
                viewCenter: DEFAULT_STATE.map.viewCenter,
                zoom: DEFAULT_STATE.map.zoom,
                highlight: null,
                showLayerSelection: false,
                isFullscreen: false,
                isLoading: false
            };

            newState.search = null;
            newState.page = null;
            newState.detail = null;
            newState.straatbeeld = null;

            newState.dataSelection = payload;

            return newState;
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
    }
})();