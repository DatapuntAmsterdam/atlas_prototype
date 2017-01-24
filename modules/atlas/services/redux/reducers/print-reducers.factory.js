(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('printReducers', printReducersFactory);

    printReducersFactory.$inject = ['ACTIONS'];

    function printReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.SHOW_PRINT.id] = showPrintReducer;
        reducers[ACTIONS.HIDE_PRINT.id] = hidePrintReducer;

        return reducers;

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function showPrintReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.atlas.isPrintMode = true;

            return newState;
        }

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function hidePrintReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.atlas.isPrintMode = false;

            return newState;
        }
    }
})();

