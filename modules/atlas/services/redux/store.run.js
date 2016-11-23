(function () {
    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = [
        'applicationState',
        'reducer',
        'stateToUrl',
        'DEFAULT_STATE',
        'contextMiddleware',
        'stateToUrlMiddleware'
    ];

    function runBlock (
            applicationState,
            reducer,
            stateToUrl,
            DEFAULT_STATE,
            contextMiddleware,
            stateToUrlMiddleware) {
        applicationState.initialize(
            reducer,
            stateToUrl,
            DEFAULT_STATE,
            contextMiddleware,
            stateToUrlMiddleware);
    }
})();
