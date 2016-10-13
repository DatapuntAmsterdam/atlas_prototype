/**
 * @ngdoc service
 * @name atlas.dashboardColumns
 * @description
 * A factory used to determine the colum layout of the application for a given state
 */

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

        /**
         * @ngdoc method
         * @name determineVisibility
         * @methodOf atlas.dashboardColumns
         * @param {object} state The state for which to determine the visibility.
         * @returns {object} An object contains the visibility of the modules in atlas
         * using the module name as key with a boolean value to denote the visibility
         * @description
         * Determines the visibility of the different modules in the application
         * given a specific state. These are the attributes of the visibility object:
         * - dataSelection
         * - map
         * - layerSelection
         * - detail
         * - page
         * - searchResults
         * - pano
         */
        function determineVisibility (state) {
            var visibility = {};

            if (angular.isObject(state.dataSelection)) {
                visibility.dataSelection = true;

                visibility.map = false;
                visibility.layerSelection = false;
                visibility.detail = false;
                visibility.page = false;
                visibility.searchResults = false;
                visibility.straatbeeld = false;
            } else {
                if (!state.isPrintMode) {
                    visibility.map = true;
                } else {
                    visibility.map = !state.map.showLayerSelection && (
                        state.map.isFullscreen ||
                        angular.isObject(state.detail) ||
                        angular.isObject(state.straatbeeld));
                }

                visibility.layerSelection = state.map.showLayerSelection;

                if (state.map.showLayerSelection || state.map.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.straatbeeld = false;
                } else {
                    visibility.detail = angular.isObject(state.detail);
                    visibility.page = angular.isString(state.page);
                    visibility.searchResults = angular.isObject(state.search) &&
                        (angular.isString(state.search.query) || angular.isArray(state.search.location));
                    visibility.straatbeeld = angular.isObject(state.straatbeeld);
                }

                visibility.dataSelection = false;
            }

            return visibility;
        }
        /**
         * @ngdoc method
         * @name determineColumnSizes
         * @methodOf atlas.dashboardColumns
         * @param {object} visibility The visibility for which to set the columns
         * @param {boolean} hasFullscreenMap Indicating if full screen map is active
         * @param {boolean} isPrintMode Indicatiing if print mode is active
         * @returns {object} An object containg three values: left, middle and right.
         * each of which has a numerical value representing the amount of grind columns
         * the have in the current state.
         * @description
         * The atlas app has a 3 column, **left, middle, and right**. At any given time at
         * least one column is visible and at most 2. The grid has itself 12 columns.
         *
         * Using the determined visibility,the print mode flag and full screen map flag,
         * the function determines what columns are visible and the column sizes.
         */
        function determineColumnSizes (visibility, hasFullscreenMap, isPrintMode) {
            if (!isPrintMode) {
                return determineColumnSizesDefault(visibility, hasFullscreenMap);
            } else {
                return determineColumnSizesPrint(visibility, hasFullscreenMap);
            }

            function determineColumnSizesDefault (visibility, hasFullscreenMap) {
                var columnSizes = {};

                if (visibility.layerSelection) {
                    columnSizes.left = 4;
                    columnSizes.middle = 8;
                } else if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
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

                if (visibility.layerSelection) {
                    columnSizes.left = 12;
                    columnSizes.middle = 0;
                    columnSizes.right = 0;
                } else if (hasFullscreenMap) {
                    columnSizes.left = 0;
                    columnSizes.middle = 12;
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
