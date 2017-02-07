describe('The onMapClick factory', () => {
    var $rootScope,
        onMapClick,
        store,
        ACTIONS,
        drawTool,
        mockedLeafletMap;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: angular.noop
                }
            }
        );

        let L;

        angular.mock.inject((_$rootScope_, _L_, _onMapClick_, _store_, _ACTIONS_, _drawTool_) => {
            $rootScope = _$rootScope_;
            onMapClick = _onMapClick_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            drawTool = _drawTool_;
            L = _L_;
        });

        mockedLeafletMap = L.map(document.createElement('div'));

        spyOn(store, 'dispatch');
        spyOn(drawTool, 'isEnabled');

        onMapClick.initialize(mockedLeafletMap);
    });

    // Mock the Leaflet click event
    function click () {
        mockedLeafletMap.fireEvent('click', {
            latlng: {
                lat: 52.124,
                lng: 4.788
            }
        });
        $rootScope.$apply();
    }

    it('dispatches an action when the map is clicked and drawtool is not enabled', () => {
        drawTool.isEnabled.and.returnValue(false);
        click();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_CLICK,
            payload: [52.124, 4.788]
        });
    });

    it('keeps onMapClick from dispatching an action when drawtool is enabled', () => {
        drawTool.isEnabled.and.returnValue(true);
        click();
        expect(store.dispatch).not.toHaveBeenCalled();
    });
});
