(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('reducer', reducerFactory);

    reducerFactory.$inject = [
        'urlReducers',
        'detailReducers',
        'homeReducers',
        'mapReducers',
        'pageReducers',
        'searchReducers',
        'straatbeeldReducers',
        'dataSelectionReducers',
        'stackedPanelsReducers',
        'printReducers'
    ];

    function reducerFactory (urlReducers,
        detailReducers,
        homeReducers,
        mapReducers,
        pageReducers,
        searchReducers,
        straatbeeldReducers,
        dataSelectionReducers,
        stackedPanelReducers,
        printReducers) {

        return function (oldState, action) {
            var actions = angular.merge(
                urlReducers,
                detailReducers,
                homeReducers,
                mapReducers,
                pageReducers,
                searchReducers,
                straatbeeldReducers,
                dataSelectionReducers,
                stackedPanelReducers,
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