(function () {
    'use strict';

    angular
        .module('atlas')
        .service('stateToUrl', stateToUrlFactory);

    stateToUrlFactory.$inject = ['$location'];

    function stateToUrlFactory ($location) {
        return {
            update: update
        };

        function update (state, useReplace) {
            var searchParams = angular.merge(
                getSearchParams(state),
                getMapParams(state),
                getPageParams(state),
                getDetailParams(state),
                getStraatbeeldParams(state),
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

        function getMapParams (state) {
            var lagen = [], isVisible;
            for (var i = 0;i < state.map.overlays.length;i++) {
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
                kaartlagen: state.map.showLayerSelection ? 'aan' : null,
                'volledig-scherm': state.map.isFullscreen ? 'aan' : null
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
                if (state.straatbeeld.id) {
                    params.id = String(state.straatbeeld.id);

                    if (state.straatbeeld.camera) {
                        params.heading = String(state.straatbeeld.camera.heading);
                        params.pitch = String(state.straatbeeld.camera.pitch);

                        if (state.straatbeeld.camera.fov) {
                            params.fov = String(state.straatbeeld.camera.fov);
                        }
                    }
                } else {
                    params.plat = String(state.straatbeeld.searchLocation[0]);
                    params.plon = String(state.straatbeeld.searchLocation[1]);
                }
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
