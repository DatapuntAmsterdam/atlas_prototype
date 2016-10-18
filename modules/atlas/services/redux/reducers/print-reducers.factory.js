/**
 * @ngdoc service
 * @name atlas.factory:printReducers
 * @description
 * A description of the factory
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('printReducers', printReducersFactory);

    printReducersFactory.$inject = ['ACTIONS'];

    function printReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.SHOW_PRINT] = showPrintReducer;
        reducers[ACTIONS.HIDE_PRINT] = hidePrintReducer;

        return reducers;

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function showPrintReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.isPrintMode = true;

            return newState;
        }

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function hidePrintReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.isPrintMode = false;

            return newState;
        }
    }
})();

