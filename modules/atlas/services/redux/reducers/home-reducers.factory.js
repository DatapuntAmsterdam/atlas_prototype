/**
 * @ngdoc service
 * @name atlas.factory:homeReducers
 * @description
 * A description of the factory
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('homeReducers', homeReducersFactory);

    homeReducersFactory.$inject = ['ACTIONS', 'DEFAULT_STATE'];

    function homeReducersFactory (ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.SHOW_HOME] = showHomeReducer;

        return reducers;

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function showHomeReducer (oldState) {
            var newState = angular.copy(DEFAULT_STATE);

            newState.isPrintMode = oldState.isPrintMode;

            return newState;
        }
    }
})();

