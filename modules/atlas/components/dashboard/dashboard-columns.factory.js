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
            let visibility = {};

            visibility.httpStatus = httpStatus.getStatus();

            if (angular.isObject(state.dataSelection)) {
                visibility.dataSelection = true;
                visibility.dataSelectionList = state.dataSelection.view === 'LIST';

                visibility.map = visibility.dataSelectionList;
                visibility.layerSelection = false;
                visibility.detail = false;
                visibility.page = false;
                visibility.searchResults = false;
                visibility.straatbeeld = false;
            } else {
                if (state.isPrintMode) {
                    visibility.map = isMapVisible(state);
                } else {
                    visibility.map = true;
                }

                visibility.layerSelection = state.layerSelection;
                visibility.straatbeeld = isStraatbeeldVisible(state);

                if (visibility.straatbeeld && state.straatbeeld.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.map = false;
                } else if (state.layerSelection || state.map.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.straatbeeld = false;
                } else {
                    visibility.detail = isDetailVisible(state);
                    visibility.page = angular.isString(state.page);
                    visibility.searchResults = isSearchResultsVisible(state);
                }

                visibility.dataSelection = false;
                visibility.dataSelectionList = false;
            }

            return visibility;
        }

        function isStraatbeeldVisible (state) {
            return angular.isObject(state.straatbeeld) && !(state.straatbeeld.isInvisible);
        }

        function isMapVisible (state) {
            return !state.layerSelection &&
                (state.map.isFullscreen ||
                 (isDetailVisible(state) && angular.isObject(state.detail.geometry)) ||
                 isStraatbeeldVisible(state)
                );
        }

        function isDetailVisible (state) {
            return angular.isObject(state.detail) && !(state.detail.isInvisible);
        }

        function isSearchResultsVisible (state) {
            return angular.isObject(state.search) &&
                (angular.isString(state.search.query) || angular.isArray(state.search.location));
        }

        function determineColumnSizesDefault (visibility, hasFullscreenElement) {
            var columnSizes = {};

            if (visibility.layerSelection) {
                columnSizes.left = 4;
                columnSizes.middle = 8;
            } else if (hasFullscreenElement) {
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

        function determineColumnSizesPrint (visibility, hasFullscreenElement) {
            var columnSizes = {};

            if (visibility.layerSelection) {
                columnSizes.left = 12;
                columnSizes.middle = 0;
                columnSizes.right = 0;
            } else if (hasFullscreenElement) {
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

        function determineColumnSizes (visibility, hasFullscreenElement, isPrintMode) {
            if (!isPrintMode) {
                return determineColumnSizesDefault(visibility, hasFullscreenElement);
            } else {
                return determineColumnSizesPrint(visibility, hasFullscreenElement);
            }
        }
    }
})();
