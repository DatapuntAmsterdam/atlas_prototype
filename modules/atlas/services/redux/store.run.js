(function () {
    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = [
        'applicationState',
        'reducer',
        'stateToUrl',
        'stateUrlConverter',
        'contextMiddleware',
        'stateToUrlMiddleware'
    ];

    function runBlock (
            applicationState,
            reducer,
            stateToUrl,
            stateUrlConverter,
            contextMiddleware,
            stateToUrlMiddleware) {
        applicationState.initialize(
            reducer,
            stateToUrl,
            stateUrlConverter.getDefaultState(),
            contextMiddleware,
            stateToUrlMiddleware);
    }
})();
