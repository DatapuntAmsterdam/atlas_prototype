/**
 * @ngdoc service
 * @name dpshared.applicationState
 * @link dpshared.applicationState applicationState
 */
(function () {
    angular
        .module('dpShared')
        .factory('applicationState', applicationStateFactory);

    applicationStateFactory.$inject = ['Redux'];

    function applicationStateFactory (Redux) {
        var store;

        return {
            initialize: initialize,
            getStore: getStore
        };

        function initialize (reducer, defaultState, middleware) {
            var enhancer = Redux.applyMiddleware(middleware);

            store = Redux.createStore(reducer, defaultState, enhancer);
        }

        function getStore () {
            return store;
        }
    }
})();