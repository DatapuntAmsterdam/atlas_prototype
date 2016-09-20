(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stackedPanelsReducers', stackedPanelsReducersFactory);

    stackedPanelsReducersFactory.$inject = ['ACTIONS'];

    function stackedPanelsReducersFactory (ACTIONS) {
        var reducers = {};

        reducers[ACTIONS.STACKED_PANELS_SHOW_FULLSCREEN_MAP] = stackedPanelsShowFullscreenMapReducer;
        reducers[ACTIONS.STACKED_PANELS_HIDE_FULLSCREEN_MAP] = removeLastStackedPanel;
        reducers[ACTIONS.STACKED_PANELS_SHOW_LAYER_SELECTION] = stackedPanelsShowLayerSelectionReducer;
        reducers[ACTIONS.STACKED_PANELS_HIDE_LAYER_SELECTION] = removeLastStackedPanel;

        return reducers;

        function stackedPanelsShowFullscreenMapReducer (oldState) {
            var newState = angular.copy(oldState);

            newState.stackedPanels.push('fullscreen');

            return newState;
        }

        function stackedPanelsShowLayerSelectionReducer (oldState) {
            var newState = angular.copy(oldState),
                oldStackedPanel;

            oldStackedPanel = oldState.stackedPanels[oldState.stackedPanels.length - 1];

            if (oldStackedPanel !== 'layer-selection') {
                newState.stackedPanels.push('layer-selection');
            }

            return newState;
        }

        function removeLastStackedPanel (oldState) {
            var newState = angular.copy(oldState);

            newState.stackedPanels.pop();

            return newState;
        }
    }
})();

