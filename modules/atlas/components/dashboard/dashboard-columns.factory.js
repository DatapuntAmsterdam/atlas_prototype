((() => {
    'use strict';

    angular
        .module('atlas')
        .factory('dashboardColumns', dashboardColumnsFactory);

    dashboardColumnsFactory.$inject = ['httpStatus'];

    function dashboardColumnsFactory (httpStatus) {
        /*
        - activity means the component is loaded (ng-if)
        - visibility means the component is shown, inactive components are never shown (ng-show)
        - columnSizes also determine whether or not something is fullscreen (.u-col-sm--12)
         */
        return {
            determineActivity,
            determineVisibility,
            determineColumnSizes,
            hasLimitedWidth,
            isPrintOrEmbedOrPreview
        };

        function determineActivity (state) {
            return {
                map: determineMapActivity(state),
                layerSelection: state.layerSelection.isEnabled,
                searchResults: angular.isObject(state.search),
                page: angular.isString(state.page.name),
                detail: angular.isObject(state.detail),
                straatbeeld: angular.isObject(state.straatbeeld),
                dataSelection: angular.isObject(state.dataSelection)
            };
        }

        function determineVisibility (state) {
            const activity = determineActivity(state);
            const visibility = {};

            visibility.httpStatus = httpStatus.getStatus().hasErrors;
            visibility.map = activity.map;

            if (angular.isObject(state.dataSelection) && !state.map.isFullscreen) {
                visibility.dataSelection = true;

                visibility.layerSelection = !state.dataSelection.isFullscreen && state.layerSelection.isEnabled;
                visibility.detail = false;
                visibility.page = false;
                visibility.searchResults = false;
                visibility.straatbeeld = false;
            } else {
                visibility.layerSelection = state.layerSelection.isEnabled;
                visibility.straatbeeld = activity.straatbeeld;

                if (visibility.straatbeeld && state.straatbeeld.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                } else if (state.layerSelection.isEnabled || state.map.isFullscreen) {
                    visibility.detail = false;
                    visibility.page = false;
                    visibility.searchResults = false;
                    visibility.straatbeeld = false;
                } else {
                    visibility.detail = activity.detail && !activity.straatbeeld;
                    visibility.page = angular.isString(state.page.name) && !activity.straatbeeld;
                    visibility.searchResults = activity.searchResults;
                }

                visibility.dataSelection = false;
            }

            if (isEmbedOrPreviewWithFullscreenMap(state)) {
                visibility.layerSelection = false;
            }

            return visibility;
        }

        function determineMapActivity (state) {
            if (isPrintOrEmbedOrPreview(state)) {
                return determineMapActivityPrint(state);
            } else {
                return determineMapActivityDefault(state);
            }
        }

        function determineMapActivityDefault (state) {
            return state.map.isFullscreen ||
                (
                    !(state.page.name && !state.map.isFullscreen && !state.straatbeeld) &&
                    !(state.detail && state.detail.isFullscreen) &&
                    !(state.dataSelection && state.dataSelection.view !== 'LIST') &&
                    !(state.search && state.search.isFullscreen) &&
                    !(state.straatbeeld && state.straatbeeld.isFullscreen)
                );
        }

        function determineMapActivityPrint (state) {
            if (isEmbedOrPreviewWithFullscreenMap(state)) {
                return true;
            }

            if (state.map.isFullscreen && !state.layerSelection.isEnabled) {
                return true;
            } else if (state.straatbeeld) {
                return !state.straatbeeld.isFullscreen;
            } else if (state.dataSelection) {
                // Show the map when in list view of data selection
                return state.dataSelection.view === 'LIST';
            } else if (angular.isObject(state.detail)) {
                // Only print the map when detail is NOT fullscreen and has geometry
                return !state.detail.isFullscreen && angular.isObject(state.detail.geometry);
            } else {
                return !state.page.name && !state.search;
            }
        }

        function determineColumnSizes (state) {
            const visibility = determineVisibility(state);
            const hasFullscreenElement = visibility.page ||
                (visibility.map && state.map.isFullscreen) ||
                (visibility.straatbeeld && state.straatbeeld.isFullscreen) ||
                (visibility.detail && state.detail.isFullscreen) ||
                (visibility.searchResults && state.search.isFullscreen) ||
                (visibility.dataSelection && state.dataSelection.isFullscreen);

            if (isPrintOrEmbedOrPreview(state)) {
                return determineColumnSizesPrint (state, visibility, hasFullscreenElement);
            } else {
                return determineColumnSizesDefault (state, visibility, hasFullscreenElement);
            }
        }

        function determineColumnSizesDefault (state, visibility, hasFullscreenElement) {
            const columnSizes = {};

            if (visibility.layerSelection) {
                columnSizes.left = 4;
                columnSizes.middle = 8;
                columnSizes.right = 0;
            } else if (hasFullscreenElement) {
                columnSizes.left = 0;
                columnSizes.middle = state.map.isFullscreen ? 12 : 0;
                columnSizes.right = !state.map.isFullscreen ? 12 : 0;
            } else {
                columnSizes.left = 0;
                columnSizes.middle = 4;
                columnSizes.right = 8;
            }

            return columnSizes;
        }

        function determineColumnSizesPrint (state, visibility, hasFullscreenElement) {
            const columnSizes = {};

            if (visibility.layerSelection) {
                columnSizes.left = 12;
                columnSizes.middle = 0;
                columnSizes.right = 0;
            } else if (hasFullscreenElement) {
                columnSizes.left = 0;
                columnSizes.middle = state.map.isFullscreen ? 12 : 0;
                columnSizes.right = !state.map.isFullscreen ? 12 : 0;
            } else {
                columnSizes.left = 0;
                columnSizes.middle = visibility.page || visibility.searchResults ? 0 : 12;
                columnSizes.right = visibility.dataSelection ? 0 : 12;
            }

            return columnSizes;
        }

        function hasLimitedWidth (state) {
            const visibility = determineVisibility(state);
            return Boolean(visibility.page);
        }

        function isEmbedOrPreviewWithFullscreenMap (state) {
            return (state.atlas.isEmbed || state.atlas.isEmbedPreview) && state.map.isFullscreen && !state.straatbeeld;
        }

        function isPrintOrEmbedOrPreview (state) {
            return state.atlas.isPrintMode || state.atlas.isEmbedPreview || state.atlas.isEmbed;
        }
    }
}))();
