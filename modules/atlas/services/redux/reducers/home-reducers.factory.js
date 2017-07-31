((() => {
    'use strict';

    angular
        .module('atlas')
        .factory('homeReducers', homeReducersFactory);

    homeReducersFactory.$inject = ['ACTIONS', 'stateUrlConverter'];

    function homeReducersFactory (ACTIONS, stateUrlConverter) {
        var reducers = {};

        reducers[ACTIONS.SHOW_HOME.id] = showHomeReducer;

        return reducers;

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function showHomeReducer (oldState) {
            var newState = angular.copy(stateUrlConverter.getDefaultState());

            newState.atlas.isPrintMode = oldState.atlas.isPrintMode;
            newState.atlas.isEmbedPreview = oldState.atlas.isEmbedPreview;
            newState.atlas.isEmbed = oldState.atlas.isEmbed;

            return newState;
        }
    }
}))();

