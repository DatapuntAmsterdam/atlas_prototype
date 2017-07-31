((() => {
    angular
        .module('atlas')
        .run(runBlock);

    runBlock.$inject = [
        'applicationState',
        'freeze',
        'reducer',
        'stateUrlConverter',
        'contextMiddleware',
        'stateToUrlMiddleware',
        'environment'
    ];

    function runBlock (
            applicationState,
            freeze,
            reducer,
            stateUrlConverter,
            contextMiddleware,
            stateToUrlMiddleware,
            environment) {
        const urlDefaultState = stateUrlConverter.getDefaultState();
        const initialState = environment.isDevelopment() ? freeze.deepFreeze(urlDefaultState) : urlDefaultState;
        applicationState.initialize(
            reducer,
            stateUrlConverter,
            initialState,
            contextMiddleware,
            stateToUrlMiddleware);
    }
}))();
