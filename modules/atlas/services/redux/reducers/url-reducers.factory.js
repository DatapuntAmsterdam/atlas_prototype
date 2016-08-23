(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlReducers', urlReducersFactory);

    urlReducersFactory.$inject = ['ACTIONS', 'DEFAULT_STATE'];

    function urlReducersFactory (ACTIONS, DEFAULT_STATE) {
        var reducers = {};

        reducers[ACTIONS.URL_CHANGE] = urlChangeReducer;

        return reducers;

        function urlChangeReducer (oldState, payload) {
            if (angular.equals(payload, {})) {
                return DEFAULT_STATE;
            } else {
                var newState = {};

                newState.search = getSearchState(payload);
                newState.map = getMapState(payload);
                newState.page = payload.pagina || null;
                newState.detail = getDetailState(oldState, payload);
                newState.straatbeeld = getStraatbeeldState(oldState, payload);
                newState.isPrintMode = getPrintState(payload);

                return newState;
            }

            function getSearchState (payload) {
                if (angular.isString(payload.zoek)) {
                    var searchState = {};

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
                return {
                    baseLayer: payload.basiskaart,
                    overlays: payload.lagen ? payload.lagen.split(',') : [],
                    viewCenter: [
                        Number(payload.lat),
                        Number(payload.lon)
                    ],
                    zoom: Number(payload.zoom),
                    highlight: payload.selectie || null,
                    showLayerSelection: angular.isString(payload.kaartlagen),
                    isFullscreen: angular.isString(payload['volledig-scherm']),
                    isLoading: false
                };
            }

            function getDetailState (oldState, payload) {
                if (angular.isString(payload.detail)) {
                    var newDetailState = {
                            endpoint: payload.detail,
                            isLoading: false
                        };

                    if (angular.isObject(oldState.detail) && oldState.detail.endpoint === payload.detail) {
                        newDetailState.geometry = oldState.detail.geometry;
                    }

                    return newDetailState;
                } else {
                    return null;
                }
            }

            function getStraatbeeldState (oldState, payload) {
                if (hasStraatbeeld(payload)) {
                    var date,
                        car,
                        camera,
                        hotspots;

                    if (oldState.straatbeeld && oldState.straatbeeld.id === Number(payload.id)) {
                        //Stuff that isn't in the URL but implicitly linked through the ID
                        date = oldState.straatbeeld.date;
                        car = oldState.straatbeeld.car || null;
                        hotspots = oldState.straatbeeld.hotspots;
                    } else {
                        date = null;
                        car = null;
                        hotspots = [];
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
                        isLoading: false
                    };
                } else {
                    return null;
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
            }

            function getPrintState (payload) {
                return angular.isString(payload['print-versie']);
            }
        }
    }
})();