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

            newState.map.isFullscreen = false;
            newState.map.showLayerSelection = true;

            return newState;
        }

        function hideLayerSelectionReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showLayerSelection = false;

            return newState;
        }
    }
})();

