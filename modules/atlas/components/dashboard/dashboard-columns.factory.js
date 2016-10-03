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
            var visibility = {};

            if (angular.isObject(state.dataSelection)) {
                visibility.dataSelection = true;

                visibility.map = false;
                visibility.layerSelection = false;
                visibility.detail = false;
                visibility.page = false;
                visibility.searchResults = false;
                visibility.panorama = false;
            } else {
                if (!state.isPrintMode) {
                    visibility.map = true;
                } else {
                    visibility.map = state.map.isFullscreen ||
                        (
                            !state.map.showLayerSelection &&
                            (angular.isObject(state.detail) || angular.isObject(state.panorama))
                        );
                }

                visibility.layerSelection = state.map.showLayerSelection;

                if (state.map.showLayerSelection || state.map.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.panorama = false;
                } else {
                    visibility.detail = angular.isObject(state.detail);
                    visibility.page = angular.isString(state.page);
                    visibility.searchResults = angular.isObject(state.search) &&
                        (angular.isString(state.search.query) || angular.isArray(state.search.location));
                    visibility.panorama = angular.isObject(state.panorama);
                }

                visibility.dataSelection = false;
            }

            return visibility;
        }

        function determineColumnSizes (visibility, hasFullscreenMap, isPrintMode) {
            if (!isPrintMode) {
                return determineColumnSizesDefault(visibility, hasFullscreenMap);
            } else {
                return determineColumnSizesPrint(visibility, hasFullscreenMap);
            }

            function determineColumnSizesDefault (visibility, hasFullscreenMap) {
                var columnSizes = {};

                if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                } else if (visibility.layerSelection) {
                    columnSizes.left = 4;
                    columnSizes.middle = 8;
                } else if (visibility.dataSelection) {
                    columnSizes.left = 0;
                    columnSizes.middle = 0;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 4;
                }

                columnSizes.right = 12 - columnSizes.left - columnSizes.middle;

                return columnSizes;
            }

            function determineColumnSizesPrint (visibility, hasFullscreenMap) {
                var columnSizes = {};

                if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 0;
                } else if (visibility.layerSelection) {
                    columnSizes.left = 12;
                    columnSizes.middle = 0;
                    columnSizes.right = 0;
                } else if (visibility.page || visibility.searchResults || visibility.dataSelection) {
                    columnSizes.left = 0;
                    columnSizes.middle = 0;
                    columnSizes.right = 12;
                } else {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
                    columnSizes.right = 12;
                }

                return columnSizes;
            }
        }
    }
})();