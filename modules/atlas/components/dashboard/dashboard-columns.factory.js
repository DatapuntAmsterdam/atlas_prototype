/**
 * @ngdoc service
 * @name atlas.dashboardColumns
 * @description
 * Determines visibility of certain elements on a page
**/

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
         * @description
         * Determines the visibility.
         *
         * @param {object} state description
         * @returns {object} visibility An object with visibility data
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
                    visibility.map = !state.layerSelection && (
                        state.map.isFullscreen ||
                        (angular.isObject(state.detail) && angular.isObject(state.detail.geometry)) ||
                        angular.isObject(state.straatbeeld));
                }

                visibility.layerSelection = state.layerSelection;

                if (state.layerSelection || state.map.isFullscreen) {
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
         * @name determineColumnSizesDefault
         * @methodOf atlas.dashboardColumns
         * @description
         * Determines default column size
         *
         * @param {object} visibility description
         * @param {boolean} hasFullscreenMap description
         * @returns {object} columnSizes an object with column sizes
        */
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

        function determineColumnSizes (visibility, hasFullscreenMap, isPrintMode) {
            if (!isPrintMode) {
                return determineColumnSizesDefault(visibility, hasFullscreenMap);
            } else {
                return determineColumnSizesPrint(visibility, hasFullscreenMap);
            }
        }
    }
})();
