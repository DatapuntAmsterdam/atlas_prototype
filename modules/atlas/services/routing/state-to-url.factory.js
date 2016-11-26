(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrl', stateToUrlFactory);

    stateToUrlFactory.$inject = ['$location', '$window', 'urlComposer'];

    function stateToUrlFactory ($location, $window, urlComposer) {
        const PRECISION = 7;    // decimals
        const PRECISION_FACTOR = Math.pow(10, PRECISION);

        return {
            create,
            update
        };

        function create (state) {
            return urlComposer.getUrl(getParams(state));
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

        function degreesAsString (d) {
            return String(Math.round(d * 10) / 10);
        }

        function coordinateAsString (c) {
            return String(Math.round(c * PRECISION_FACTOR) / PRECISION_FACTOR);
        }

        function locationAsString (loc) {
            return loc.map(c => coordinateAsString(c)).join(',');
        }

        function getSearchParams (state) {
            var params = {};

            if (state.search) {
                if (angular.isString(state.search.query)) {
                    params.zoek = state.search.query;
                } else {
                    params.zoek = locationAsString(state.search.location);
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
                lat: coordinateAsString(state.map.viewCenter[0]),
                lon: coordinateAsString(state.map.viewCenter[1]),
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
            }

            return params;
        }

        function getStraatbeeldParams (state) {
            var params = {};

            if (state.straatbeeld) {
                params.id = state.straatbeeld.id;
                if (angular.isArray(state.straatbeeld.location)) {
                    params.straatbeeld = locationAsString(state.straatbeeld.location);
                }
                if (state.straatbeeld.isInvisible) {
                    params.straatbeeldInvisible = true;  // Only store in url on truthy value
                }
                params.heading = degreesAsString(state.straatbeeld.heading);
                params.pitch = degreesAsString(state.straatbeeld.pitch);
                params.fov = degreesAsString(state.straatbeeld.fov);
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
