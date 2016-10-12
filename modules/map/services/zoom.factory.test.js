describe('The zoom factory', function () {
    var $rootScope,
        L,
        zoom,
        store,
        ACTIONS,
        panning,
        mockedLeafletMap,
        mockedScaleControl,
        mockedZoomControl,
        moveEndCallback,
        mockedLocation;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                mapConfig: {
                    ZOOM_OPTIONS: {
                        foo: 'bar'
                    },
                    SCALE_OPTIONS: {
                        metric: 'bitte',
                        imperial: 'ga weg'
                    }
                },
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _L_, _zoom_, _store_, _ACTIONS_, _panning_) {
            $rootScope = _$rootScope_;
            L = _L_;
            zoom = _zoom_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            panning = _panning_;
        });

        mockedLeafletMap = {
            getZoom: function () {
                return 6;
            },
            on: function (eventName, callbackFn) {
                moveEndCallback = callbackFn;
            },
            setZoom: function () {}
        };

        mockedScaleControl = {
            addTo: function () {}
        };

        mockedZoomControl = {
            addTo: function () {}
        };

        mockedLocation = [50.789, 4.987];

        spyOn(L.control, 'scale').and.returnValue(mockedScaleControl);
        spyOn(mockedScaleControl, 'addTo');

        spyOn(L.control, 'zoom').and.returnValue(mockedZoomControl);
        spyOn(mockedZoomControl, 'addTo');

        spyOn(mockedLeafletMap, 'on').and.callThrough();
        spyOn(mockedLeafletMap, 'setZoom');
        spyOn(store, 'dispatch');

        spyOn(panning, 'getCurrentLocation').and.returnValue(mockedLocation);
    });

    it('adds a scale to the map', function () {
        zoom.initialize(mockedLeafletMap);

        expect(L.control.scale).toHaveBeenCalledWith({
            metric: 'bitte',
            imperial: 'ga weg'
        });

        expect(mockedScaleControl.addTo).toHaveBeenCalledWith(mockedLeafletMap);
    });

    it('adds zoom controls to the map', function () {
        zoom.initialize(mockedLeafletMap);

        expect(L.control.zoom).toHaveBeenCalledWith({
            foo: 'bar'
        });

        expect(mockedZoomControl.addTo).toHaveBeenCalledWith(mockedLeafletMap);
    });

    it('can zoom in and out', function () {
        // Set a initial zoom
        zoom.setZoom(mockedLeafletMap, 12);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledTimes(1);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(12);

        // Zoom in
        zoom.setZoom(mockedLeafletMap, 16);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledTimes(2);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(16);

        // Zoom out
        zoom.setZoom(mockedLeafletMap, 8);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledTimes(3);
        expect(mockedLeafletMap.setZoom).toHaveBeenCalledWith(8);
    });

    it('listens for Leaflet\'s zoomend event, then it fires the MAP_ZOOM action', function () {
        zoom.initialize(mockedLeafletMap);

        expect(mockedLeafletMap.on).toHaveBeenCalledWith('zoomend', jasmine.any(Function));
        expect(moveEndCallback).toBeDefined();

        // Trigger the moveend callback manually
        moveEndCallback();

        // Nothing happens directly
        expect(store.dispatch).not.toHaveBeenCalled();

        // But store.dispatch is triggered during the next digest cycle
        $rootScope.$apply();

        // The viewCenter will change when zooming in
        expect(panning.getCurrentLocation).toHaveBeenCalledWith(mockedLeafletMap);

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.MAP_ZOOM,
            payload: {
                viewCenter: [50.789, 4.987],
                zoom: 6
            }
        });
    });
});
