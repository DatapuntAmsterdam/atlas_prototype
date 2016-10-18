describe('The dataSelectionReducers factory', function () {
    var dataSelectionReducers,
        DEFAULT_STATE,
        ACTIONS;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_dataSelectionReducers_, _DEFAULT_STATE_, _ACTIONS_) {
            dataSelectionReducers = _dataSelectionReducers_;
            DEFAULT_STATE = _DEFAULT_STATE_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('SHOW_DATA_SELECTION', function () {
        var payload;

        beforeEach(function () {
            payload = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };
        });

        it('resets the map, but preservers the active baseLayer and overlays', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            mockedState.map = {
                baseLayer: 'luchtfoto_1914',
                overlays: ['OVERLAY_1', 'OVERLAY_2'],
                viewCenter: [52.52, 4.4],
                zoom: 16,
                isFullscreen: true,
                isLoading: true
            };
            mockedState.layerSelection = true;

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

            // It keeps the active layers
            expect(output.map.baseLayer).toBe('luchtfoto_1914');
            expect(output.map.overlays).toEqual(['OVERLAY_1', 'OVERLAY_2']);

            // It resets view and zoom to the default state
            expect(output.map.viewCenter).toEqual(DEFAULT_STATE.map.viewCenter);
            expect(output.map.zoom).toBe(DEFAULT_STATE.map.zoom);

            // It disables the rest
            expect(output.map.isFullscreen).toBe(false);
            expect(output.map.isLoading).toBe(false);
            expect(output.layerSelection).toBe(false);
        });

        it('sets the dataSelection state', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

            expect(output.dataSelection).toEqual({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            });
        });

        it('disables search, page, detail and straatbeeld', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);
            mockedState.search = {some: 'object'};
            mockedState.page = 'somePage';
            mockedState.detail = {some: 'object'};
            mockedState.straatbeeld = {some: 'object'};

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);

            expect(output.search).toBeNull();
            expect(output.page).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
        });

        it('preserves the isPrintMode variable', function () {
            var mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            // With print mode enabled
            mockedState.isPrintMode = true;
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);
            expect(output.isPrintMode).toBe(true);

            // With print mode disabled
            mockedState.isPrintMode = false;
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION](mockedState, payload);
            expect(output.isPrintMode).toBe(false);
        });
    });

    describe('NAVIGATE_DATA_SELECTION', function () {
        it('updates the page', function () {
            var mockedState = angular.copy(DEFAULT_STATE),
                output;

            mockedState.dataSelection = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };

            output = dataSelectionReducers[ACTIONS.NAVIGATE_DATA_SELECTION](mockedState, 4);

            expect(output.dataSelection).toEqual({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 4
            });
        });
    });
});
