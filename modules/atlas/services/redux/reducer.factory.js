/**
 * @ngdoc service
 * @name atlas.service:reducer
 * @description
 * A description of the service
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('reducer', reducerFactory);

    reducerFactory.$inject = [
        'urlReducers',
        'detailReducers',
        'homeReducers',
        'layerReducers',
        'mapReducers',
        'pageReducers',
        'searchReducers',
        'straatbeeldReducers',
        'dataSelectionReducers',
        'printReducers'
    ];

    function reducerFactory (urlReducers,
        detailReducers,
        homeReducers,
        layerReducers,
        mapReducers,
        pageReducers,
        searchReducers,
        straatbeeldReducers,
        dataSelectionReducers,
        printReducers) {

        return function (oldState, action) {
            var actions = angular.merge(
                urlReducers,
                detailReducers,
                homeReducers,
                layerReducers,
                mapReducers,
                pageReducers,
                searchReducers,
                straatbeeldReducers,
                dataSelectionReducers,
                printReducers
            );

            if (angular.isDefined(action) && angular.isDefined(actions[action.type])) {
                return actions[action.type](oldState, action.payload);
            } else {
                return oldState;
            }
        };
    }
})();