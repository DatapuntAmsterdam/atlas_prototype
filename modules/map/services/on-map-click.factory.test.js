describe('The onMapClick factory', () => {
    var $rootScope,
        L,
        onMapClick,
        store,
        ACTIONS,
        mockedLeafletMap;

    beforeEach(() => {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    getState: angular.noop,
                    subscribe: angular.noop,
                    dispatch: angular.noop
                }
            }
        );

        angular.mock.inject((_$rootScope_, _L_, _onMapClick_, _store_, _ACTIONS_) => {
            $rootScope = _$rootScope_;
            L = _L_;
            onMapClick = _onMapClick_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedLeafletMap = L.map(document.createElement('div'));

        spyOn(store, 'dispatch');
        spyOn(store, 'getState');
        spyOn(store, 'subscribe');

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

    it('dispatches an action when the map is clicked', () => {
        click();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_CLICK,
            payload: [52.124, 4.788]
        });
    });

    describe('drawing mode state', () => {
        let handler;

        beforeEach(() => {
            handler = store.subscribe.calls.first().args[0];
        });

        it('keeps onMapClick from dispatching an action when set to DRAW', () => {
            store.getState.and.returnValue({ map: { drawingMode: 'DRAW' } });
            handler();

            click();

            expect(store.dispatch).not.toHaveBeenCalled();
        });

        it('keeps onMapClick from dispatching an action when set to DRAW after an action has been dispatched', () => {
            click();

            store.dispatch.calls.reset();

            store.getState.and.returnValue({ map: { drawingMode: 'DRAW' } });
            handler();

            click();

            expect(store.dispatch).not.toHaveBeenCalled();
        });

        it('does not keep onMapClick from dispatching an action when set to anything but DRAW', () => {
            // EDIT
            store.getState.and.returnValue({ map: { drawingMode: 'EDIT' } });
            handler();

            click();

            expect(store.dispatch).toHaveBeenCalled();

            // null
            store.dispatch.calls.reset();

            store.getState.and.returnValue({ map: { drawingMode: null } });
            handler();

            click();

            expect(store.dispatch).toHaveBeenCalled();
        });
    });
});
