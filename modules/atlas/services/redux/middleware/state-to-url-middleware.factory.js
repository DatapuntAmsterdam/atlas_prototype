(() => {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrlMiddleware', stateToUrlMiddlewareFactory);

    stateToUrlMiddlewareFactory.$inject = ['stateToUrl', 'ACTIONS'];

    function stateToUrlMiddlewareFactory (stateToUrl, ACTIONS) {
        return (store) => {
            return (next) => {
                return (action) => {
                    // Are we dealing with vanilla js reducers here (type is a
                    // string instead of an object with an ID and other
                    // optional attributes)?
                    const vanilla = angular.isString(action.type);

                    const ignoredActions = ['AUTHENTICATE_USER', 'MAP_START_DRAWING',
                        'MAP_EMPTY_GEOMETRY', 'MAP_UPDATE_SHAPE',
                        'SET_DATA_SELECTION_GEOMETRY_FILTER', 'RESET_DATA_SELECTION_GEOMETRY_FILTER'];

                    // Update the state first
                    const returnValue = next(action);

                    // Then update the URL
                    if ((vanilla || !action.type.ignore) && !ignoredActions.includes(action.type)) {
                        stateToUrl.update(
                            store.getState(),
                            !vanilla && Boolean(action.type.replace)
                        );
                    }
                    return returnValue;
                };
            };
        };
    }
})();
