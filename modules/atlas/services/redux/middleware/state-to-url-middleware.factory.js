(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrlMiddleware', stateToUrlMiddlewareFactory);

    stateToUrlMiddlewareFactory.$inject = ['stateToUrl', 'ACTIONS'];

    function stateToUrlMiddlewareFactory (stateToUrl, ACTIONS) {
        return function (store) {
            return function (next) {
                return function (action) {
                    var returnValue;

                    // Update the state first
                    returnValue = next(action);

                    // Then update the URL
                    if (!action.type.ignore) {
                        stateToUrl.update(
                            store.getState(),
                            Boolean(action.type.replace)
                        );
                    }
                    return returnValue;
                };
            };
        };
    }
})();
