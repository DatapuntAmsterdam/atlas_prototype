(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dashboardColumns', dashboardColumnsFactory);

    function dashboardColumnsFactory () {
        return {
            determineVisibility: determineVisibility,
            determineColumnSizes: determineColumnSizes
        };

        function determineVisibility (state) {
            return {
                map: !state.isPrintMode ||
                        state.map.isFullscreen ||
                        (!state.map.showLayerSelection &&
                            (angular.isObject(state.detail) || angular.isObject(state.straatbeeld))
                        ),
                layerSelection: state.map.showLayerSelection,
                page: !state.map.showLayerSelection && !state.map.isFullscreen && angular.isString(state.page),
                detail: !state.map.showLayerSelection && !state.map.isFullscreen && angular.isObject(state.detail),
                straatbeeld:
                    !state.map.showLayerSelection && !state.map.isFullscreen && angular.isObject(state.straatbeeld),
                searchResults: !state.map.showLayerSelection &&
                    !state.map.isFullscreen && angular.isObject(state.search) &&
                    (angular.isString(state.search.query) || angular.isArray(state.search.location))
            };
        }

        function determineColumnSizes (visibility, hasFullscreenMap, isPrintMode) {
            var columnSizes = {};

            if (!isPrintMode) {
                if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                } else if (visibility.layerSelection) {
                    columnSizes.left = 8;
                    columnSizes.middle = 4;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 4;
                }

                columnSizes.right = 12 - columnSizes.left - columnSizes.middle;
            } else {
                if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 0;
                } else if (visibility.layerSelection) {
                    columnSizes.left = 12;
                    columnSizes.middle = 0;
                    columnSizes.right = 0;
                } else if (visibility.page || visibility.searchResults) {
                    columnSizes.left = 0;
                    columnSizes.middle = 0;
                    columnSizes.right = 12;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 12;
                }
            }

            return columnSizes;
        }
    }
})();