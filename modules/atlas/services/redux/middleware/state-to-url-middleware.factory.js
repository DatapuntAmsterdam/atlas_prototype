(function () {
    'use strict';

    angular
        .module('atlas')
        .factory('stateToUrlMiddleware', stateToUrlMiddlewareFactory);

    stateToUrlMiddlewareFactory.$inject = ['stateToUrl', 'ACTIONS'];

    function stateToUrlMiddlewareFactory (stateToUrl, ACTIONS) {
        var ignoreActions = [
                ACTIONS.URL_CHANGE, // Prevent infinite loops
                ACTIONS.FETCH_DETAIL, // Don't update the state before asynchronous call are finished
                ACTIONS.FETCH_STRAATBEELD,
                ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY,
                ACTIONS.FETCH_SEARCH_RESULTS_BY_CLICK,
                ACTIONS.FETCH_SEARCH_RESULTS_CATEGORY
            ],
            useReplace = [
                ACTIONS.MAP_SET_BASELAYER, // Replace the URL instead of adding a new entry to the browser history
                ACTIONS.MAP_ADD_OVERLAY,
                ACTIONS.MAP_REMOVE_OVERLAY,
                ACTIONS.MAP_TOGGLE_VISIBILITY_OVERLAY,
                ACTIONS.MAP_PAN,
                ACTIONS.MAP_ZOOM,
                ACTIONS.SHOW_STRAATBEELD_SUBSEQUENT,
                ACTIONS.STRAATBEELD_SET_ORIENTATION,
                ACTIONS.SHOW_MAP_ACTIVE_OVERLAYS,
                ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS
            ];

        return function (store) {
            return function (next) {
                return function (action) {
                    var returnValue;

                    // Update the state first
                    returnValue = next(action);

                    // Then update the URL
                    if (ignoreActions.indexOf(action.type) === -1) {
                        stateToUrl.update(
                            store.getState(),
                            useReplace.indexOf(action.type) !== -1
                        );
                    }
                    return returnValue;
                };
            };
        };
    }
})();
