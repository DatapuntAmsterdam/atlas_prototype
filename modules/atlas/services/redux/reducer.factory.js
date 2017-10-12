(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('reducer', reducerFactory);

    reducerFactory.$inject = [
        '$rootScope',
        '$timeout',
        '$window',
        'urlReducers',
        'freeze',
        'homeReducers',
        'layerSelectionReducers',
        'mapReducers',
        'pageReducers',
        'searchReducers',
        'straatbeeldReducers',
        'dataSelectionReducers',
        'printReducers',
        'embedReducers',
        'filtersReducers',
        'environment'
    ];

    // eslint-disable-next-line max-params
    function reducerFactory ($rootScope,
                             $timeout,
                             $window,
                             urlReducers,
                             freeze,
                             homeReducers,
                             layerSelectionReducers,
                             mapReducers,
                             pageReducers,
                             searchReducers,
                             straatbeeldReducers,
                             dataSelectionReducers,
                             printReducers,
                             embedReducers,
                             filtersReducers,
                             environment) {
        return function (oldState, action) {
            const UserReducer = $window.UserReducer;
            const MapLayersReducer = $window.MapLayersReducer;
            const MapOverlaysReducer = $window.MapOverlaysReducer;

            // TODO: Redux: replace
            // Warning: angular.merge is deprecated
            // -- https://docs.angularjs.org/api/ng/function/angular.merge

            const detailReducers = {
                FETCH_DETAIL: $window.reducers.detailReducer,
                SHOW_DETAIL: $window.reducers.detailReducer,
                DETAIL_FULLSCREEN: $window.reducers.detailReducer
            };

            const userReducer = {
                AUTHENTICATE_USER: UserReducer,
                AUTHENTICATE_ERROR: UserReducer
            };

            const mapLayersReducer = {
                FETCH_MAP_LAYERS_FAILURE: MapLayersReducer,
                FETCH_MAP_LAYERS_REQUEST: MapLayersReducer,
                FETCH_MAP_LAYERS_SUCCESS: MapLayersReducer
            };

            const mapOverlaysReducer = {
                TOGGLE_MAP_OVERLAY: MapOverlaysReducer,
                TOGGLE_MAP_OVERLAY_VISIBILITY: MapOverlaysReducer
            };

            var actions = angular.merge(
                urlReducers,
                detailReducers,
                mapLayersReducer,
                homeReducers,
                userReducer,
                layerSelectionReducers,
                mapReducers,
                pageReducers,
                searchReducers,
                straatbeeldReducers,
                dataSelectionReducers,
                printReducers,
                embedReducers,
                filtersReducers,
                environment
            );

            if (detailReducers.hasOwnProperty(action.type.id)) {
                action.payload = {
                    payload: action.payload,
                    type: action.type.id
                };
            }

            if (userReducer.hasOwnProperty(action.type)) {
                return UserReducer(oldState, action);
            }

            if (mapLayersReducer.hasOwnProperty(action.type)) {
                return MapLayersReducer(oldState, action);
            }

            if (mapOverlaysReducer.hasOwnProperty(action.type)) {
                const newState = MapOverlaysReducer(oldState, action);
                $timeout(() => $rootScope.$digest());
                return newState;
            }

            if (angular.isObject(action) &&
                angular.isObject(action.type) &&
                angular.isFunction(actions[action.type.id])) {
                const result = actions[action.type.id](oldState, action.payload);
                if (environment.isDevelopment()) {
                    freeze.deepFreeze(result);
                }
                return result;
            } else {
                // TODO: Redux: throw error
                return oldState;
            }
        };
    }
})();
