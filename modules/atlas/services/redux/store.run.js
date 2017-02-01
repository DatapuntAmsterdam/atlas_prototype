(function () {
    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = [
        'applicationState',
        'reducer',
        'stateUrlConverter',
        'contextMiddleware',
        'stateToUrlMiddleware'
    ];

    function runBlock (
            applicationState,
            reducer,
            stateUrlConverter,
            contextMiddleware,
            stateToUrlMiddleware) {
        applicationState.initialize(
            reducer,
            stateUrlConverter,
            stateUrlConverter.getDefaultState(),
            contextMiddleware,
            stateToUrlMiddleware);
    }
})();
