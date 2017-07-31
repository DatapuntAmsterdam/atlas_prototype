describe('The urlToState factory', () => {
    var $location,
        $rootScope,
        urlToState,
        authenticator,
        store,
        ACTIONS,
        mockedSearchParams;

    beforeEach(() => {
        angular.mock.module(
            'atlas',
            {
                store: {
                    dispatch: function () {}
                },
                authenticator: {
                    initialize: angular.noop,
                    isCallback: () => false,
                    handleCallback: angular.noop
                }
            }
        );

        angular.mock.inject((
            _$location_,
            _$rootScope_,
            _urlToState_,
            _authenticator_,
            _store_,
            _ACTIONS_
        ) => {
            $location = _$location_;
            $rootScope = _$rootScope_;
            authenticator = _authenticator_;
            urlToState = _urlToState_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedSearchParams = {
            lat: '52.123',
            lon: '4.789'
        };

        spyOn(store, 'dispatch');
    });

    it('initializes the authenticator on startup', () => {
        spyOn(authenticator, 'initialize');
        urlToState.initialize();
        expect(authenticator.initialize).toHaveBeenCalled();
    });

    it('routes authentication responses via the authenticator', () => {
        spyOn(authenticator, 'isCallback').and.returnValue(true);
        spyOn(authenticator, 'handleCallback');

        urlToState.initialize();
        $rootScope.$apply();

        authenticator.handleCallback.calls.reset();

        const params = {one: 1, two: 2};
        $location.search(params);

        $rootScope.$apply();

        expect(authenticator.handleCallback).toHaveBeenCalledWith(params);
        expect(store.dispatch).not.toHaveBeenCalled();
    });

    it('routes all other responses via dispatch action', () => {
        spyOn(authenticator, 'isCallback').and.returnValue(false);
        spyOn(authenticator, 'handleCallback');

        urlToState.initialize();
        $rootScope.$apply();

        const params = {one: 1, two: 2};
        $location.search(params);

        $rootScope.$apply();

        expect(authenticator.handleCallback).not.toHaveBeenCalledWith();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: params
        });
    });

    it('dispatches the URL_CHANGE action once on initialisation', () => {
        $location.search(mockedSearchParams);

        urlToState.initialize();
        $rootScope.$apply();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: mockedSearchParams
        });
    });

    it('dispatches the URL_CHANGE action whenever the search parameters change', () => {
        var changedSearchParams;

        urlToState.initialize();
        $rootScope.$apply();

        changedSearchParams = {
            lat: 52.789,
            lon: 4.123
        };

        $location.search(changedSearchParams);
        $rootScope.$apply();

        // Initial parameters
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: changedSearchParams
        });

        // Changes parameters
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.URL_CHANGE,
            payload: changedSearchParams
        });
    });
});
