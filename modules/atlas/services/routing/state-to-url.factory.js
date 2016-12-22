(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrl', stateToUrlFactory)
        .config(html5mode);

    html5mode.$inject = ['$locationProvider'];

    function html5mode ($locationProvider) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    stateToUrlFactory.$inject = ['$location', '$window'];

    function stateToUrlFactory ($location, $window) {
        return {
            create,
            update
        };

        function create (state) {
            const params = getParams(state);
            let key,
                queryString = '';

            for (key in params) {
                if (params.hasOwnProperty(key) && params[key] !== null) {
                    queryString += queryString ? '&' : '?';
                    queryString += `${key}=${encodeURI(params[key])}`;
                }
            }

            return queryString;
        }

        function update (state, useReplace) {
            const params = getParams(state);

            if (useReplace) {
                $location.replace();
            }

            $location.search(params);
        }

        function getParams (state) {
            return angular.merge(
                getSearchParams(state),
                getMapParams(state),
                getLayerSelectionParams(state),
                getPageParams(state),
                getDetailParams(state),
                getStraatbeeldParams(state),
                getDataSelectionParams(state),
                getPrintParams(state)
            );
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
            var params = {};

            if (state.detail) {
                params.detail = state.detail.endpoint || null;
                if (state.detail.isInvisible) {
                    params.detailInvisible = true;  // Only store in url on truthy value
                }

                params['volledig-detail'] = state.detail.isFullscreen ? 'aan' : null;
            }

            return params;
        }

        function getStraatbeeldParams (state) {
            var params = {};

            if (state.straatbeeld) {
                params.id = state.straatbeeld.id;
                if (angular.isArray(state.straatbeeld.location)) {
                    params.straatbeeld = state.straatbeeld.location.join(',');
                }
                if (state.straatbeeld.isInvisible) {
                    params.straatbeeldInvisible = true;  // Only store in url on truthy value
                }
                params.heading = String(state.straatbeeld.heading);
                params.pitch = String(state.straatbeeld.pitch);
                params.fov = String(state.straatbeeld.fov);
                params['volledig-straatbeeld'] = state.straatbeeld.isFullscreen ? 'aan' : null;
            }

            return params;
        }

        function getDataSelectionParams (state) {
            var params = {},
                datasetFilters = [];

            if (angular.isObject(state.dataSelection)) {
                params.view = state.dataSelection.view;
                params.dataset = state.dataSelection.dataset;

                angular.forEach(state.dataSelection.filters, function (value, key) {
                    datasetFilters.push(key + ':' + encodeURIComponent(value));
                });

                if (datasetFilters.length) {
                    params['dataset-filters'] = datasetFilters.join('::');
                }

                if (state.dataSelection.query) {
                    params['dataset-zoek'] = state.dataSelection.query;
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
