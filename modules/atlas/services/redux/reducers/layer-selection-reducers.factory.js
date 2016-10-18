(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('layerSelectionReducers', layerSelectionReducersFactory);

    layerSelectionReducersFactory.$inject = ['ACTIONS'];

    function layerSelectionReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.SHOW_LAYER_SELECTION] = showLayerSelectionReducer;
        reducers[ACTIONS.HIDE_LAYER_SELECTION] = hideLayerSelectionReducer;

        return reducers;

        function showLayerSelectionReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.layerSelection = true;

            return newState;
        }

        function hideLayerSelectionReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.layerSelection = false;

            return newState;
        }
    }
})();

