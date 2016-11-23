describe('The onMapClick factory', function () {
    var $rootScope,
        L,
        onMapClick,
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

        angular.mock.inject(function (_$rootScope_, _L_, _onMapClick_, _store_, _ACTIONS_) {
            $rootScope = _$rootScope_;
            L = _L_;
            onMapClick = _onMapClick_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedLeafletMap = L.map(document.createElement('div'));
    });

    it('dispatches an action when the map is clicked', function () {
        onMapClick.initialize(mockedLeafletMap);

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
            type: ACTIONS.MAP_CLICK,
            payload: [52.124, 4.788]
        });
    });
});
