(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dataSelectionReducers', dataSelectionReducersFactory);

    dataSelectionReducersFactory.$inject = [
        'ACTIONS',
        'DEFAULT_STATE'
    ];

    function dataSelectionReducersFactory (ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.SHOW_DATA_SELECTION.id] = showDataSelectionReducer;
        reducers[ACTIONS.NAVIGATE_DATA_SELECTION.id] = navigateDataSelectionReducer;
        reducers[ACTIONS.SET_DATA_SELECTION_VIEW.id] = setDataSelectionViewReducer;

        return reducers;

        /**
         * @param {Object} oldState
         * @param {Object} payload - On object with two keys: dataset (String) and filters (Object)
         *
         * @returns {Object} newState
         */
        function showDataSelectionReducer (oldState, payload) {
            let newState = angular.copy(oldState);

            newState.map.viewCenter = DEFAULT_STATE.map.viewCenter;
            newState.map.zoom = DEFAULT_STATE.map.zoom;
            newState.map.isFullscreen = false;
            newState.map.isLoading = false;

            newState.layerSelection = false;
            newState.search = null;
            newState.page = null;
            newState.detail = null;
            newState.straatbeeld = null;

            newState.dataSelection = angular.copy(payload);

            if (!newState.dataSelection.view) {
                // Default view is table view
                newState.dataSelection.view = 'TABLE';
            }

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {Number} payload - The destination page
         *
         * @returns {Object} newState
         */
        function navigateDataSelectionReducer (oldState, payload) {
            let newState = angular.copy(oldState);

            newState.dataSelection.page = payload;

            return newState;
        }

        /**
         * @param {Object} oldState
         * @param {String} payload
         *
         * @returns {Object} newState
         */
        function setDataSelectionViewReducer (oldState, payload) {
            let newState = angular.copy(oldState);

            ['LIST', 'TABLE'].forEach(legalValue => {
                if (payload === legalValue) {
                    newState.dataSelection.view = payload;
                }
            });

            return newState;
        }
    }
})();
