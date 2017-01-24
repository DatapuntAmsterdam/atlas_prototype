(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('urlReducers', urlReducersFactory);

    urlReducersFactory.$inject = ['ACTIONS', 'stateUrlConverter'];

    function urlReducersFactory (ACTIONS, stateUrlConverter) {
        return {
            [ACTIONS.URL_CHANGE.id]: urlChangeReducer
        };

        function urlChangeReducer (oldState, payload) {
            return stateUrlConverter.params2state(oldState, payload);
        }
    }
})();
