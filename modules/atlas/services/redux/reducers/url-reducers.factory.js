(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlReducers', urlReducersFactory);

    urlReducersFactory.$inject = ['$window', 'ACTIONS', 'DEFAULT_STATE'];

    function urlReducersFactory ($window, ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.URL_CHANGE.id] = urlChangeReducer;

        return reducers;

        function urlChangeReducer (oldState, payload) {
            if (angular.equals(payload, {})) {
                return DEFAULT_STATE;
            } else {
                var newState = {};

                newState.search = getSearchState(oldState, payload);
                newState.map = getMapState(payload);
                newState.layerSelection = getLayerSelectionState(payload);
                newState.page = payload.pagina || null;
                newState.detail = getDetailState(oldState, payload);
                newState.straatbeeld = getStraatbeeldState(oldState, payload);
                newState.dataSelection = getDataSelectionState(oldState, payload);
                newState.isPrintMode = getPrintState(payload);

                return newState;
            }
        }

        function getSearchState (oldState, payload) {
            if (angular.isString(payload.zoek)) {
                var searchState = angular.copy(oldState.search) || {};

                if (isLocation(payload.zoek)) {
                    searchState.query = null;
                    searchState.location = payload.zoek.split(',').map(function (coordinate) {
                        return Number(coordinate);
                    });
                } else {
                    searchState.query = payload.zoek;
                    searchState.location = null;
                }

                searchState.category = payload.categorie || null;

                if (!angular.equals(searchState, oldState.search)) {
                    searchState.isLoading = true;
                }

                return searchState;
            } else {
                return null;
            }

            /**
             * @description Check if a String matches this location format: '53.123,4.789'.
             *
             * @param {String} location
             *
             * @returns {Boolean}
             */
            function isLocation (location) {
                return angular.isArray(
                    location.match(/^\d+\.\d+,\d+\.\d+$/)
                );
            }
        }

        function getMapState (payload) {
            var overlays = [],
                layers,
                id,
                isVisible;

            if (payload && payload.lagen) {
                layers = payload.lagen.split(',');
                for (var i = 0; i < layers.length; i++) {
                    // [id, isVisible] = layers[i].split(':');  This is ES6
                    id = layers[i].split(':');
                    // checking isVisible
                    isVisible = id[1] === 'zichtbaar';
                    id = id[0];
                    overlays.push({id: id, isVisible: isVisible});
                }
            }
            return {
                baseLayer: payload.basiskaart,
                overlays: overlays,
                viewCenter: [
                    Number(payload.lat),
                    Number(payload.lon)
                ],
                zoom: Number(payload.zoom),
                showActiveOverlays: angular.isString(payload['actieve-kaartlagen']),
                isFullscreen: angular.isString(payload['volledig-scherm']),
                isLoading: false
            };
        }

        function getLayerSelectionState (payload) {
            return angular.isString(payload['kaartlagen-selectie']);
        }

        function getDetailState (oldState, payload) {
            if (angular.isString(payload.detail)) {
                var newDetailState = {
                    endpoint: payload.detail,
                    isLoading: true
                };

                if (angular.isObject(oldState.detail) && oldState.detail.endpoint === payload.detail) {
                    newDetailState.display = oldState.detail.display;
                    newDetailState.geometry = oldState.detail.geometry;
                    newDetailState.isLoading = oldState.detail.isLoading;
                    newDetailState.isFullscreen = oldState.detail.isFullscreen;
                } else {
                    newDetailState.isFullscreen = angular.isString(payload['volledig-detail']);
                }

                // restore invisibility from url payload
                newDetailState.isInvisible = Boolean(payload.detailInvisible);

                return newDetailState;
            } else {
                return null;
            }
        }

        function getStraatbeeldState (oldState, payload) {
            if (payload.id || payload.straatbeeld) {
                // A straatbeeld is identified by it's id or it's location
                var newStraatbeeld = {
                    pitch: Number(payload.pitch),
                    fov: Number(payload.fov),
                    id: payload.id,
                    location: payload.straatbeeld ? payload.straatbeeld.split(',').map(c => Number(c)) : null,
                    heading: Number(payload.heading)
                };

                // restore invisibility from url payload
                newStraatbeeld.isInvisible = Boolean(payload.straatbeeldInvisible);
                newStraatbeeld.isFullscreen = angular.isString(payload['volledig-straatbeeld']);

                if (oldState.straatbeeld && oldState.straatbeeld.id === payload.id) {
                    newStraatbeeld.image = oldState.straatbeeld.image;
                    newStraatbeeld.hotspots = oldState.straatbeeld.hotspots;
                    newStraatbeeld.date = oldState.straatbeeld.date;
                    newStraatbeeld.location = oldState.straatbeeld.location;
                    newStraatbeeld.isInitial = false;
                    newStraatbeeld.isLoading = oldState.straatbeeld.isLoading;
                } else {
                    newStraatbeeld.image = null;
                    newStraatbeeld.hotspots = [];
                    newStraatbeeld.date = null;
                    newStraatbeeld.isInitial = true;
                    newStraatbeeld.isLoading = true;
                }

                return newStraatbeeld;
            } else {
                return null;
            }
        }

        function getDataSelectionState (oldState, payload) {
            var filters = {};

            if (angular.isString(payload.dataset)) {
                if (angular.isString(payload['dataset-filters'])) {
                    payload['dataset-filters'].split('::').forEach(function (filterFromUrl) {
                        var keyValueArray = filterFromUrl.split(':');

                        filters[keyValueArray[0]] = decodeURIComponent(keyValueArray[1]);
                    });
                }

                let view = payload.view && String(payload.view);

                return {
                    view,
                    dataset: payload.dataset,
                    filters: filters,
                    query: payload['dataset-zoek'],
                    page: Number(payload['dataset-pagina']),
                    markers: oldState.dataSelection && oldState.dataSelection.markers || [],
                    isLoading: angular.isObject(oldState.dataSelection) ? oldState.dataSelection.isLoading : true,
                    isFullscreen: view !== 'LIST'
                };
            } else {
                return null;
            }
        }

        function getPrintState (payload) {
            return angular.isString(payload['print-versie']);
        }
    }
})();
