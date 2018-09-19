import PAGES, { isCmsPage, isMapPanelPage } from '../../../../src/pages';

(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('dashboardColumns', dashboardColumnsFactory);

    function dashboardColumnsFactory () {
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

        function determineActivity (state) { // eslint-disable-line complexity
            //
            // ROUTING
            //
            // Translates ui.page to old style range of variables
            // disable all previous activity and visibility logic
            const activity = {
                dataSelection: false,
                detail: false,
                map: false,
                mapPreviewPanel: false,
                page: false,
                searchResults: false,
                straatbeeld: false
            };

            activity.dataSelection = state.ui.page === PAGES.ADRESSEN ||
                state.ui.page === PAGES.KAART_ADRESSSEN ||
                state.ui.page === PAGES.DATASETS ||
                state.ui.page === PAGES.SEARCH_DATASETS;

            activity.page = state.ui.page === PAGES.HOME || isCmsPage(state.ui.page);

            activity.map = state.ui.page === PAGES.KAART ||
                state.ui.page === PAGES.KAART_DETAIL ||
                state.ui.page === PAGES.KAART_PANORAMA ||
                state.ui.page === PAGES.KAART_ADRESSSEN ||
                state.ui.page === PAGES.KAART_SEARCH;

            activity.straatbeeld = state.ui.page === PAGES.PANORAMA ||
                state.ui.page === PAGES.KAART_PANORAMA;

            activity.searchResults = state.ui.page === PAGES.KAART_SEARCH ||
                state.ui.page === PAGES.SEARCH_DATA;

            activity.detail = state.ui.page === PAGES.KAART_DETAIL ||
                state.ui.page === PAGES.DATASETS_DETAIL;

            return activity;
        }

        function determineVisibility (state) {
            const activity = determineActivity(state);
            const visibility = {
                error: false,
                map: false,
                straatbeeld: false,
                detail: false,
                page: false,
                searchResults: false,
                dataSelection: false
            };
            visibility.dataSelection = activity.dataSelection;
            visibility.page = activity.page;
            visibility.map = activity.map;
            visibility.straatbeeld = activity.straatbeeld;
            visibility.searchResults = activity.searchResults;
            visibility.detail = activity.detail;
            return visibility;
        }

        function determineColumnSizes (state) { // eslint-disable-line complexity
            const activity = determineActivity(state);
            let columnSizes = {
                left: 4,
                middle: 4,
                right: 4
            };

            if (state.ui.page === PAGES.HOME) {
                columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (isCmsPage(state.ui.page)) {
                columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (activity.map) {
                columnSizes = {
                    left: 0,
                    middle: 12,
                    right: 0
                };
            } else if (state.ui.page === PAGES.DATASETS_DETAIL) {
                columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (state.ui.page === PAGES.PANORAMA) {
                columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (activity.dataSelection) {
                columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            } else if (activity.searchResults) {
                columnSizes = {
                    left: 0,
                    middle: 0,
                    right: 12
                };
            }

            if (isMapPanelPage(state.ui.page)) {
                columnSizes = {
                    left: 0,
                    middle: 4,
                    right: 8
                };
            }
            return columnSizes;
        }

        function hasLimitedWidth (state) {
            const visibility = determineVisibility(state);
            return Boolean(visibility.page);
        }

        function isPrintOrEmbedOrPreview (state) {
            return state.ui && (state.ui.isPrintMode || state.ui.isEmbedPreview || state.ui.isEmbed);
        }
    }
})();
