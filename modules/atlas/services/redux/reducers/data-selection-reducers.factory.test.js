describe('The dataSelectionReducers factory', function () {
    let dataSelectionReducers,
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

    describe('FETCH_DATA_SELECTION', function () {
        let payload;

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
            let mockedState,
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

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

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

        it('has a default table view', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                view: 'TABLE'
            }));
        });

        it('can display in list view', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);
            payload.view = 'LIST';

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                view: 'LIST'
            }));
        });

        it('sets the dataSelection dataset, filters and page', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            }));
        });

        it('sets the dataSelection query', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            payload = 'zoek';

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                query: 'zoek'
            }));
        });

        it('makes the Array of markers empty', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                markers: []
            }));
        });

        it('sets isLoading to true', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.isLoading).toBe(true);
        });

        it('disables search, page, detail and straatbeeld', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);
            mockedState.search = {some: 'object'};
            mockedState.page = 'somePage';
            mockedState.detail = {some: 'object'};
            mockedState.straatbeeld = {some: 'object'};

            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.search).toBeNull();
            expect(output.page).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
        });

        it('preserves the isPrintMode variable', function () {
            let mockedState,
                output;

            mockedState = angular.copy(DEFAULT_STATE);

            // With print mode enabled
            mockedState.isPrintMode = true;
            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);
            expect(output.isPrintMode).toBe(true);

            // With print mode disabled
            mockedState.isPrintMode = false;
            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);
            expect(output.isPrintMode).toBe(false);
        });
    });

    describe('SHOW_DATA_SELECTION', function () {
        let mockedState,
            payload,
            output;

        beforeEach(function () {
            mockedState = {
                dataSelection: {
                    dataset: 'bag',
                    filters: {
                        buurtcombinatie: 'Geuzenbuurt',
                        buurt: 'Trompbuurt'
                    },
                    page: 1,
                    isLoading: true
                },
                map: {}
            };

            payload = ['MOCKED', 'MARKER', 'ARRAY'];
        });

        it('adds markers to the state', function () {
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.markers).toEqual(['MOCKED', 'MARKER', 'ARRAY']);
        });

        it('sets isLoading to false', function () {
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.isLoading).toEqual(false);
        });

        it('sets map.isLoading to true when any markers are added to the state', function () {
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);
            expect(output.map.isLoading).toBe(true);

            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, []);
            expect(output.map.isLoading).toBe(false);
        });

        it('does nothing if the user has navigated away from dataSelection before the API is finished', function () {
            mockedState.dataSelection = null;
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toBeNull();
        });
    });

    describe('SET_DATA_SELECTION_VIEW', function () {
        it('can set the view to list view', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {dataSelection: {}},
                'LIST'
            );

            expect(output.dataSelection.view).toBe('LIST');
        });

        it('can set the view to table view', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {dataSelection: {}},
                'TABLE'
            );

            expect(output.dataSelection.view).toBe('TABLE');
        });

        it('refuses to set the view to an unknown view', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {dataSelection: {}},
                'aap'
            );

            expect(output.dataSelection.view).toBeUndefined();
        });

        it('sets isLoading to true', function () {
            let output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](
                {
                    dataSelection: {
                        isLoading: false
                    }
                },
                'LIST'
            );

            expect(output.dataSelection.isLoading).toBe(true);
        });
    });

    describe('NAVIGATE_DATA_SELECTION', function () {
        it('updates the page', function () {
            let mockedState = angular.copy(DEFAULT_STATE),
                output;

            mockedState.dataSelection = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };

            output = dataSelectionReducers[ACTIONS.NAVIGATE_DATA_SELECTION.id](mockedState, 4);

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
