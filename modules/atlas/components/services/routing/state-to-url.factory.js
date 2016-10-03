(function () {
    'use strict';

    angular
        .module('atlas')
        .service('stateToUrl', stateToUrlFactory);

    stateToUrlFactory.$inject = ['$location', '$window'];

    function stateToUrlFactory($location, $window) {
        return {
            update: update
        };

        function update(state, useReplace) {
            var searchParams = angular.merge(
                getSearchParams(state),
                getMapParams(state),
                getPageParams(state),
                getDetailParams(state),
                getPanoramaParams(state),
                getDataSelectionParams(state),
                getPrintParams(state)
            );

            if (useReplace) {
                $location.replace();
            }

            $location.search(searchParams);
        }

        function getSearchParams(state) {
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

        function getMapParams(state) {
            var lagen = [], isVisible;
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
                selectie: state.map.highlight,
                'kaartlagen-selectie': state.map.showLayerSelection ? 'aan' : null,
                'actieve-kaartlagen': state.map.showActiveOverlays ? 'aan' : null,
                'volledig-scherm': state.map.isFullscreen ? 'aan' : null
            };
        }

        function getPageParams(state) {
            return {
                pagina: state.page
            };
        }

        function getDetailParams(state) {
            return {
                detail: state.detail && state.detail.endpoint || null
            };
        }

        function getPanoramaParams(state) {
            
            var params = {};
            
            if (state.panorama) {
                params.id = state.panorama.id;
                params.heading = String(state.panorama.heading);
                params.pitch = String(state.panorama.pitch);
                params.fov = String(state.panorama.fov);
            }
                    
            return params;
        }

        function getDataSelectionParams(state) {
            var params = {},
                datasetFilters = [];

            if (angular.isObject(state.dataSelection)) {
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

        function getPrintParams(state) {
            return {
                'print-versie': state.isPrintMode ? 'aan' : null
            };
        }
    }
})();
