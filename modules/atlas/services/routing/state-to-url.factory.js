/**
 * @ngdoc service
 * @name atlas.service:stateToUrl
 * @description
 * Determines visibility of certain elements on a page
**/
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrl', stateToUrlFactory);

    stateToUrlFactory.$inject = ['$location', '$window'];

    function stateToUrlFactory ($location, $window) {
        return {
            update: update
        };

        /**
         * @ngdoc method
         * @name update
         * @methodOf atlas.service:stateToUrl
         * @description
         * Updates the URL based on state
         *
         * @param {object} state current state
         * @param {boolean} useReplace replace the entire url
        */
        function update (state, useReplace) {
            var searchParams = angular.merge(
                getSearchParams(state),
                getMapParams(state),
                getLayerSelectionParams(state),
                getPageParams(state),
                getDetailParams(state),
                getStraatbeeldParams(state),
                getDataSelectionParams(state),
                getPrintParams(state)
            );

            if (useReplace) {
                $location.replace();
            }

            $location.search(searchParams);
        }

        function getSearchParams (state) {
            var params = {};

            if (state.search) {
                if (angular.isString(state.search.query)) {
                    params.zoek = state.search.query;
                } else {
                    params.zoek = state.search.location.join(',');
                }

                params.categorie = state.search.category;
            }

            return params;
        }

        /**
         * @ngdoc method
         * @name _getMapParams
         * @methodOf atlas.service:stateToUrl
         * @description
         * Get map parameters
         *
         * @param {object} state current state
         * @returns {object} state-object <pre>{
         *     lat: lat,
         *     lon: lon,
         *     basiskaart: basiskaart,
         *     zoom: zoom
         * }</pre>
        */
        function getMapParams (state) {
            var lagen = [],
                isVisible;
            for (var i = 0; i < state.map.overlays.length; i++) {
                if (state.map.overlays[i].isVisible) {
                    isVisible = 'zichtbaar';
                } else {
                    isVisible = 'onzichtbaar';
                }
                lagen.push(state.map.overlays[i].id + ':' + isVisible);
            }
            return {
                lat: String(state.map.viewCenter[0]),
                lon: String(state.map.viewCenter[1]),
                basiskaart: state.map.baseLayer,
                lagen: lagen.join(',') || null,
                zoom: String(state.map.zoom),
                'actieve-kaartlagen': state.map.showActiveOverlays ? 'aan' : null,
                'volledig-scherm': state.map.isFullscreen ? 'aan' : null
            };
        }

        function getLayerSelectionParams (state) {
            return {
                'kaartlagen-selectie': state.layerSelection ? 'aan' : null
            };
        }

        function getPageParams (state) {
            return {
                pagina: state.page
            };
        }

        function getDetailParams (state) {
            return {
                detail: state.detail && state.detail.endpoint || null
            };
        }

        function getStraatbeeldParams (state) {
            var params = {};

            if (state.straatbeeld) {
                params.id = state.straatbeeld.id;
                params.heading = String(state.straatbeeld.heading);
                params.pitch = String(state.straatbeeld.pitch);
                params.fov = String(state.straatbeeld.fov);
            }

            return params;
        }

        function getDataSelectionParams (state) {
            var params = {},
                datasetFilters = [];

            if (angular.isObject(state.dataSelection)) {
                if (state.dataSelection.listView) {
                    params['list-view'] = state.dataSelection.listView;
                }
                params.dataset = state.dataSelection.dataset;

                angular.forEach(state.dataSelection.filters, function (value, key) {
                    datasetFilters.push(key + ':' + $window.encodeURIComponent(value));
                });

                if (datasetFilters.length) {
                    params['dataset-filters'] = datasetFilters.join(',');
                }

                params['dataset-pagina'] = String(state.dataSelection.page);
            }

            return params;
        }

        function getPrintParams (state) {
            return {
                'print-versie': state.isPrintMode ? 'aan' : null
            };
        }
    }
})();
