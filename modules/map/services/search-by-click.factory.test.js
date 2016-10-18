describe('The searchByClick factory', function () {
    var $rootScope,
        L,
        searchByClick,
        store,
        ACTIONS,
        mockedLeafletMap;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _L_, _searchByClick_, _store_, _ACTIONS_) {
            $rootScope = _$rootScope_;
            L = _L_;
            searchByClick = _searchByClick_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedLeafletMap = L.map(document.createElement('div'));
    });

    it('dispatches an action when the map is clicked', function () {
        searchByClick.initialize(mockedLeafletMap);

        spyOn(store, 'dispatch');

        // Mock the Leaflet click event
        mockedLeafletMap.fireEvent('click', {
            latlng: {
                lat: 52.124,
                lng: 4.788
            }
        });

        $rootScope.$apply();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.FETCH_SEARCH_RESULTS_BY_CLICK,
            payload: [52.124, 4.788]
        });
    });
});
