(function () {
    angular
        .module('dpShared')
        .factory('applicationState', applicationStateFactory);

    applicationStateFactory.$inject = ['Redux'];

    function applicationStateFactory (Redux) {
        let store,
            reducer,
            stateToUrl;

        return {
            initialize,
            getStore: () => store,
            getReducer: () => reducer,
            getStateToUrl: () => stateToUrl
        };

        function initialize (_reducer_, _stateToUrl_, defaultState, ...middleware) {
            var enhancer = Redux.applyMiddleware(...middleware);
            reducer = _reducer_;
            stateToUrl = _stateToUrl_;
            store = Redux.createStore(reducer, defaultState, enhancer);
        }
    }
})();
