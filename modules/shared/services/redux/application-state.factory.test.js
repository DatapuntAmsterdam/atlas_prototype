describe('The applicationState factory', () => {
    let Redux,
        applicationState;
    const $window = {},
        fakeReducer = 'I_AM_THE_REDUCER',
        fakeStateUrlConverter = 'I_AM_THE_STATE_URL_CONVERTER',
        fakeDefaultState = 'THIS_IS_THE_DEFAULT_STATE',
        fakeMiddleware = 'I_AM_MIDDLEWARE',
        fakeEnhancer = 'I_AM_A_FAKE_ENHANCER',
        fakeStore = 'THIS_IS_THE_FAKE_STORE';

    beforeEach(() => {
        angular.mock.module('dpShared', $provide => {
            $provide.value('$window', $window);
        });

        angular.mock.inject((_Redux_, _applicationState_) => {
            Redux = _Redux_;
            applicationState = _applicationState_;
        });

        spyOn(Redux, 'compose').and.callThrough();
        spyOn(Redux, 'applyMiddleware').and.returnValue(fakeEnhancer);
        spyOn(Redux, 'createStore').and.returnValue(fakeStore);
    });

    it('creates a Redux store by passing through a reducer, default state and middleware', () => {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);

        expect(Redux.applyMiddleware).toHaveBeenCalledWith(fakeMiddleware);
        expect(Redux.createStore).toHaveBeenCalledWith(fakeReducer, fakeDefaultState, fakeEnhancer);
    });

    it('excepts an arbitrary amount of middleware', () => {
        applicationState
            .initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware, fakeMiddleware);
        expect(Redux.applyMiddleware).toHaveBeenCalledWith(fakeMiddleware, fakeMiddleware);

        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState);
        expect(Redux.applyMiddleware).toHaveBeenCalledWith();
    });

    it('can return the store', () => {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getStore()).toBe('THIS_IS_THE_FAKE_STORE');
    });

    it('can return the reducer', () => {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getReducer()).toBe('I_AM_THE_REDUCER');
    });

    it('can return the stateToUrl', () => {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(applicationState.getStateUrlConverter()).toBe('I_AM_THE_STATE_URL_CONVERTER');
    });

    it('should call Redux.compose if devtool is not on window', () => {
        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(Redux.compose).toHaveBeenCalledWith(fakeEnhancer);
    });

    it('should use the window __REDUX_DEVTOOLS_EXTENSION_COMPOSE__ if available', () => {
        $window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = jasmine.createSpy('__REDUX_DEVTOOLS_EXTENSION_COMPOSE__');

        applicationState.initialize(fakeReducer, fakeStateUrlConverter, fakeDefaultState, fakeMiddleware);
        expect(Redux.compose).not.toHaveBeenCalled();
        expect($window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__).toHaveBeenCalledWith(fakeEnhancer);
    });
});
