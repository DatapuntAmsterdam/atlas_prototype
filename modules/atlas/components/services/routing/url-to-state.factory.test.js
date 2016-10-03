describe('The urlToState factory', function () {
    var $location,
        $rootScope,
        urlToState,
        store,
        mockedSearchParams;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_$location_, _$rootScope_, _urlToState_, _store_) {
            $location = _$location_;
            $rootScope = _$rootScope_;
            urlToState = _urlToState_;
            store = _store_;
        });

        mockedSearchParams = {
            lat: '52.123',
            lon: '4.789'
        };

        spyOn(store, 'dispatch');
    });

    it('dispatches the URL_CHANGE action once on initialisation', function () {
        $location.search(mockedSearchParams);

        urlToState.initialize();
        $rootScope.$apply();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'URL_CHANGE',
            payload: mockedSearchParams
        });
    });

    it('dispatches the URL_CHANGE action whenever the search parameters change', function () {
        var changedSearchParams;

        urlToState.initialize();
        $rootScope.$apply();

        changedSearchParams = {
            lat: 52.789,
            lon: 4.123
        };

        $location.search(changedSearchParams);
        $rootScope.$apply();

        //Initial parameters
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'URL_CHANGE',
            payload: changedSearchParams
        });

        //Changes parameters
        expect(store.dispatch).toHaveBeenCalledWith({
            type: 'URL_CHANGE',
            payload: changedSearchParams
        });
    });
});