/**
 * @ngdoc service
 * @name atlas.factory:urlReducers
 * @description
 * A description of the factory
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlReducers', urlReducersFactory);

    urlReducersFactory.$inject = ['$window', 'ACTIONS', 'DEFAULT_STATE'];

    function urlReducersFactory ($window, ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.URL_CHANGE] = urlChangeReducer;

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
                newState.dataSelection = getDataSelectionState(payload);
                newState.isPrintMode = getPrintState(payload);

                return newState;
            }
        }

        function hasStraatbeeld (payload) {
            return payload.id || hasSearchLocation(payload);
        }

        /**
         * @description This is a 'search nearest straatbeeld' location, not the location of the camera of a
         * found panorama scene. The actual location is not stored in the URL, this is implicitly accessible
         * through the ID.
         */
        function hasSearchLocation (payload) {
            return payload.plat && payload.plon;
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
                }

                return newDetailState;
            } else {
                return null;
            }
        }

        function getStraatbeeldState (oldState, payload) {
            if (hasStraatbeeld(payload)) {
                var date = null,
                    car = null,
                    camera,
                    hotspots = [],
                    isLoading = true;

                if (oldState.straatbeeld && oldState.straatbeeld.id === Number(payload.id)) {
                    // Stuff that isn't in the URL but implicitly linked through the ID
                    date = oldState.straatbeeld.date;
                    car = oldState.straatbeeld.car || null;
                    hotspots = oldState.straatbeeld.hotspots;
                    isLoading = oldState.straatbeeld.isLoading;
                }

                camera = {
                    heading: Number(payload.heading),
                    pitch: Number(payload.pitch)
                };

                if (payload.fov) {
                    camera.fov = Number(payload.fov);
                }

                return {
                    id: Number(payload.id) || null,
                    searchLocation:
                        hasSearchLocation(payload) ? [Number(payload.plat), Number(payload.plon)] : null,
                    date: date,
                    car: car,
                    camera: camera,
                    hotspots: hotspots,
                    isLoading: isLoading
                };
            } else {
                return null;
            }
        }

        function getDataSelectionState (payload) {
            var filters = {};

            if (angular.isString(payload.dataset)) {
                if (angular.isString(payload['dataset-filters'])) {
                    payload['dataset-filters'].split(',').forEach(function (filterFromUrl) {
                        var keyValueArray = filterFromUrl.split(':');

                        filters[keyValueArray[0]] = $window.decodeURIComponent(keyValueArray[1]);
                    });
                }

                return {
                    dataset: payload.dataset,
                    filters: filters,
                    page: Number(payload['dataset-pagina'])
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
