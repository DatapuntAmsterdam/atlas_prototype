(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dashboardColumns', dashboardColumnsFactory);

    dashboardColumnsFactory.$inject = ['httpStatus'];

    function dashboardColumnsFactory (httpStatus) {
        return {
            determineVisibility: determineVisibility,
            determineColumnSizes: determineColumnSizes
        };

        function determineVisibility (state) {
            var visibility = {};

            visibility.httpStatus = httpStatus.getStatus();

            if (angular.isObject(state.dataSelection)) {
                visibility.dataSelection = true;
                visibility.dataSelectionList = state.dataSelection.listView;

                visibility.map = visibility.dataSelectionList;
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
                        (isDetailVisible(state) && angular.isObject(state.detail.geometry)) ||
                        isStraatbeeldVisible(state));
                }

                visibility.layerSelection = state.layerSelection;

                if (state.layerSelection || state.map.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.straatbeeld = false;
                } else {
                    visibility.detail = isDetailVisible(state);
                    visibility.page = angular.isString(state.page);
                    visibility.searchResults = angular.isObject(state.search) &&
                        (angular.isString(state.search.query) || angular.isArray(state.search.location));
                    visibility.straatbeeld = isStraatbeeldVisible(state);
                }

                visibility.dataSelection = false;
                visibility.dataSelectionList = false;
            }

            return visibility;
        }

        function isStraatbeeldVisible (state) {
            return angular.isObject(state.straatbeeld) && !(state.straatbeeld.isInvisible);
        }

        function isDetailVisible (state) {
            return angular.isObject(state.detail) && !(state.detail.isInvisible);
        }

        function determineColumnSizesDefault (visibility, hasFullscreenMap) {
            var columnSizes = {};

            if (visibility.layerSelection) {
                columnSizes.left = 4;
                columnSizes.middle = 8;
            } else if (hasFullscreenMap) {
                columnSizes.left = 0;
                columnSizes.middle = 12;
            } else if (visibility.dataSelection && !visibility.dataSelectionList) {
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
