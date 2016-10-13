/**
 * @ngdoc service
 * @name atlas.factory:layerReducers
 * @description
 * A description of the factory
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('layerReducers', layerReducersFactory);

    layerReducersFactory.$inject = ['ACTIONS'];

    function layerReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.SHOW_LAYER_SELECTION] = showLayerSelectionReducer;
        reducers[ACTIONS.HIDE_LAYER_SELECTION] = hideLayerSelectionReducer;
        reducers[ACTIONS.SHOW_ACTIVE_OVERLAYS] = showActiveOverlaysReducer;
        reducers[ACTIONS.HIDE_ACTIVE_OVERLAYS] = hideActiveOverlaysReducer;

        return reducers;

        function showLayerSelectionReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showLayerSelection = true;

            return newState;
        }

        function hideLayerSelectionReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showLayerSelection = false;

            return newState;
        }

        function showActiveOverlaysReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showActiveOverlays = true;

            return newState;
        }

        function hideActiveOverlaysReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.map.showActiveOverlays = false;

            return newState;
        }
    }
})();

