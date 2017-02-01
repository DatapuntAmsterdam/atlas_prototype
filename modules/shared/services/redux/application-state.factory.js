(function () {
    angular
        .module('dpShared')
        .factory('applicationState', applicationStateFactory);

    applicationStateFactory.$inject = ['Redux'];

    function applicationStateFactory (Redux) {
        let store,
            reducer,
            stateUrlConverter;

        return {
            initialize,
            getStore: () => store,
            getReducer: () => reducer,
            getStateUrlConverter: () => stateUrlConverter
        };

        function initialize (_reducer_, _stateUrlConverter_, defaultState, ...middleware) {
            reducer = _reducer_;
            stateUrlConverter = _stateUrlConverter_;

            let enhancer = Redux.applyMiddleware(...middleware);
            store = Redux.createStore(reducer, defaultState, enhancer);
        }
    }
})();
