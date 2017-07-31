((() => {
    angular
        .module('dpShared')
        .factory('applicationState', applicationStateFactory);

    applicationStateFactory.$inject = ['$window', 'Redux'];

    function applicationStateFactory ($window, Redux) {
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

            const composeEnhancers = $window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || Redux.compose;
            const enhancer = composeEnhancers(
                Redux.applyMiddleware(...middleware)
            );

            store = Redux.createStore(reducer, defaultState, enhancer);

            $window.reduxStore = store;
        }
    }
}))();
