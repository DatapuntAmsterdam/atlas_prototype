((() => {
    'use strict';

    angular
        .module('atlas')
        .factory('embedReducers', embedReducersFactory);

    embedReducersFactory.$inject = ['ACTIONS'];

    function embedReducersFactory (ACTIONS, DRAW_TOOL_CONFIG) {
        var reducers = {};

        reducers[ACTIONS.SHOW_EMBED_PREVIEW.id] = showEmbedPreviewReducer;
        reducers[ACTIONS.HIDE_EMBED_PREVIEW.id] = hideEmbedPreviewReducer;

        return reducers;

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function showEmbedPreviewReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.atlas.isEmbedPreview = true;

            return newState;
        }

        /**
         * @param {Object} oldState
         *
         * @returns {Object} newState
         */
        function hideEmbedPreviewReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.atlas.isEmbedPreview = false;

            return newState;
        }
    }
}))();

