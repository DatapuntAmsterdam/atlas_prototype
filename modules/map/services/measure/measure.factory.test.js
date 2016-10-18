describe('The measure factory', function () {
    var $rootScope,
        L,
        measure,
        MEASURE_CONFIG,
        store,
        ACTIONS,
        mockedLeafletMap,
        mockedMeasureControl;

    beforeEach(function () {
        angular.mock.module(
            'dpMap',
            {
                store: {
                    dispatch: function () {}
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _L_, _measure_, _MEASURE_CONFIG_, _store_, _ACTIONS_) {
            $rootScope = _$rootScope_;
            L = _L_;
            measure = _measure_;
            MEASURE_CONFIG = _MEASURE_CONFIG_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        L.Control.Measure = function () {};

        mockedLeafletMap = {
            on: function () {}
        };

        mockedMeasureControl = {
            addTo: function () {}
        };

        spyOn(L.Control, 'Measure').and.returnValue(mockedMeasureControl);
        spyOn(mockedMeasureControl, 'addTo');
        spyOn(store, 'dispatch');
    });

    it('adds a the measure control to the map', function () {
        measure.initialize(mockedLeafletMap);

        expect(L.Control.Measure).toHaveBeenCalledWith(MEASURE_CONFIG);
        expect(mockedMeasureControl.addTo).toHaveBeenCalledWith(mockedLeafletMap);
    });

    it('dispatches HIDE_MAP_ACTIVE_OVERLAYS when starting to measure', function () {
        var domElement,
            mockedMap;

        domElement = document.createElement('div');
        mockedMap = L.map(domElement);

        measure.initialize(mockedMap);

        mockedMap.fireEvent('measurestart');
        $rootScope.$apply();

        expect(store.dispatch).toHaveBeenCalledWith({
            type: ACTIONS.HIDE_MAP_ACTIVE_OVERLAYS
        });
    });
});
