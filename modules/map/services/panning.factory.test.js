describe('The panning factory', function () {
    var $rootScope,
        panning,
        store,
        ACTIONS,
        mockedLocation,
        mockedLeafletMap,
        moveEndCallback;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _panning_, _store_, _ACTIONS_) {
            $rootScope = _$rootScope_;
            panning = _panning_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        mockedLocation = [52.3532487, 4.9992091];

        mockedLeafletMap = {
            getCenter: function () {
                return {
                    lat: 52.123,
                    lng: 4.789
                };
            },
            on: function (eventName, callbackFn) {
                moveEndCallback = callbackFn;
            },
            panTo: function () {}
        };

        spyOn(mockedLeafletMap, 'on').and.callThrough();
        spyOn(mockedLeafletMap, 'panTo');
        spyOn(store, 'dispatch');
    });

    it('can pan to a location', function () {
        panning.panTo(mockedLeafletMap, mockedLocation);

        expect(mockedLeafletMap.panTo).toHaveBeenCalledWith(mockedLocation, jasmine.any(Object));
    });

    it('prevents infinite loops; it won\'t fire if the new location is equal to the current location', function () {
        panning.panTo(mockedLeafletMap, [52.123, 4.789]);

        expect(mockedLeafletMap.panTo).not.toHaveBeenCalled();
    });

    it('listens for Leaflet\'s moveend event, then it fires the MAP_PAN action', function () {
        panning.initialize(mockedLeafletMap);

        expect(mockedLeafletMap.on).toHaveBeenCalledWith('dragend', jasmine.any(Function));
        expect(moveEndCallback).toBeDefined();

        // Trigger the moveend callback manually
        moveEndCallback();

        // Nothing happens directly
        expect(store.dispatch).not.toHaveBeenCalled();

        // But store.dispatch is triggered during the next digest cycle
        $rootScope.$apply();
        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_PAN,
            payload: [52.123, 4.789]
        });
    });

    it('has disabled animations', function () {
        // By default animations are disabled
        panning.panTo(mockedLeafletMap, [52.1, 4.1]);
        expect(mockedLeafletMap.panTo).toHaveBeenCalledWith([52.1, 4.1], {animate: false});
    });

    it('exposes the getCurrentLocation function', function () {
        expect(panning.getCurrentLocation(mockedLeafletMap)).toEqual([52.123, 4.789]);
    });
});
