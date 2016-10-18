(function () {
    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = ['applicationState', 'reducer', 'DEFAULT_STATE', 'stateToUrlMiddleware'];

    function runBlock (applicationState, reducer, DEFAULT_STATE, stateToUrlMiddleware) {
        applicationState.initialize(reducer, DEFAULT_STATE, stateToUrlMiddleware);
    }
})();
