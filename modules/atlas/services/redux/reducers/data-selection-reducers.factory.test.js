describe('The dataSelectionReducers factory', () => {
    let dataSelectionReducers,
        ACTIONS;

    const DEFAULT_STATE = {
        map: {
            baseLayer: 'topografie',
            overlays: [],
            viewCenter: [52.3719, 4.9012],
            zoom: 9,
            showActiveOverlays: false,
            isFullscreen: false,
            isLoading: false
        },
        layerSelection: {
            isEnabled: false
        },
        search: null,
        page: {
            name: 'home'
        },
        detail: null,
        straatbeeld: null,
        dataSelection: null,
        atlas: {
            isPrintMode: false
        }
    };

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_dataSelectionReducers_, _ACTIONS_) => {
            dataSelectionReducers = _dataSelectionReducers_;
            ACTIONS = _ACTIONS_;
        });
    });

    describe('FETCH_DATA_SELECTION', () => {
        let payload;

        beforeEach(() => {
            payload = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };
        });

        it('makes the map small (!isFullscreen), relevant when navigating via dp-dropdown-menu', () => {
            const mockedState = angular.copy(DEFAULT_STATE);
            mockedState.map.isFullscreen = true;

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.map.isFullscreen).toBe(false);
        });

        it('has a default table view and set map not to be loading', () => {
            const mockedState = angular.copy(DEFAULT_STATE);

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                view: 'TABLE'
            }));
            expect(output.map.isLoading).toEqual(false);
        });

        it('can display in list view and set map to be loading', () => {
            const mockedState = angular.copy(DEFAULT_STATE);
            payload.view = 'LIST';

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                view: 'LIST'
            }));
            expect(output.map.isLoading).toEqual(true);
        });

        it('sets the dataSelection dataset, filters and page', () => {
            const mockedState = angular.copy(DEFAULT_STATE);

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            }));
        });

        it('sets the dataSelection query, page, view, dataset and empties filters', () => {
            const mockedState = angular.copy(DEFAULT_STATE);
            mockedState.filters = {
                a: 'a'
            };

            payload = 'zoek';

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                query: 'zoek',
                page: 1,
                view: 'CARDS',
                dataset: 'catalogus'
            }));
            expect(output.dataSelection.filters).toEqual({});
        });

        it('defaults the filters to an empty object', () => {
            const mockedState = angular.copy(DEFAULT_STATE);

            // Object as payload
            delete payload.filters;
            const fromObjectOutput = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);
            expect(fromObjectOutput.dataSelection.filters).toEqual({});

            // String as payload
            payload = 'zoek';
            const fromStringOutput = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);
            expect(fromStringOutput.dataSelection.filters).toEqual({});
        });

        it('makes the Array of markers empty', () => {
            const mockedState = angular.copy(DEFAULT_STATE);

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toEqual(jasmine.objectContaining({
                markers: []
            }));
        });

        it('sets isLoading to true', () => {
            const mockedState = angular.copy(DEFAULT_STATE);

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.isLoading).toBe(true);
        });

        it('disables search, page, detail and straatbeeld', () => {
            const mockedState = angular.copy(DEFAULT_STATE);
            mockedState.search = {some: 'object'};
            mockedState.page.name = 'somePage';
            mockedState.detail = {some: 'object'};
            mockedState.straatbeeld = {some: 'object'};

            const output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);

            expect(output.search).toBeNull();
            expect(output.page.name).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
        });

        it('preserves the isPrintMode variable', () => {
            let output;
            const mockedState = angular.copy(DEFAULT_STATE);

            // With print mode enabled
            mockedState.atlas.isPrintMode = true;
            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);
            expect(output.atlas.isPrintMode).toBe(true);

            // With print mode disabled
            mockedState.atlas.isPrintMode = false;
            output = dataSelectionReducers[ACTIONS.FETCH_DATA_SELECTION.id](mockedState, payload);
            expect(output.atlas.isPrintMode).toBe(false);
        });
    });

    describe('SHOW_DATA_SELECTION', () => {
        let mockedState,
            payload,
            output;

        beforeEach(() => {
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
                map: {
                    isLoading: true
                }
            };

            payload = ['MOCKED', 'MARKER', 'ARRAY'];
        });

        it('adds markers to the state', () => {
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.markers).toEqual(['MOCKED', 'MARKER', 'ARRAY']);
        });

        it('sets isLoading to false', () => {
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.isLoading).toEqual(false);
        });

        it('sets map isLoading to false', () => {
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.map.isLoading).toEqual(false);
        });

        it('does nothing if the user has navigated away from dataSelection before the API is finished', () => {
            mockedState.dataSelection = null;
            output = dataSelectionReducers[ACTIONS.SHOW_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toBeNull();
        });
    });

    describe('RESET_DATA_SELECTION', () => {
        let mockedState,
            payload,
            output;

        beforeEach(() => {
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
                map: {
                    isLoading: true
                }
            };

            payload = ['MOCKED', 'MARKER', 'ARRAY'];
        });

        it('adds markers to the state', () => {
            output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.markers).toEqual(['MOCKED', 'MARKER', 'ARRAY']);
        });

        it('sets isLoading to false', () => {
            output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.isLoading).toEqual(false);
        });

        it('sets map isLoading to false', () => {
            output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION.id](mockedState, payload);

            expect(output.map.isLoading).toEqual(false);
        });

        it('does nothing if the user has navigated away from dataSelection before the API is finished', () => {
            mockedState.dataSelection = null;
            output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection).toBeNull();
        });

        it('sets the reset flag to false', () => {
            mockedState.dataSelection.reset = true;
            output = dataSelectionReducers[ACTIONS.RESET_DATA_SELECTION.id](mockedState, payload);

            expect(output.dataSelection.reset).toBe(false);
        });
    });

    describe('SET_DATA_SELECTION_VIEW', () => {
        let mockedState,
            payload,
            output;

        beforeEach(() => {
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
        });

        it('can set the view to list view and set map to be loading', () => {
            payload = 'LIST';

            output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](mockedState, payload);

            expect(output.dataSelection.view).toBe('LIST');
            expect(output.map.isLoading).toBe(true);
        });

        it('can set the view to table view and set map not to be loading', () => {
            payload = 'TABLE';

            output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](mockedState, payload);

            expect(output.dataSelection.view).toBe('TABLE');
            expect(output.map.isLoading).toBe(false);
        });

        it('refuses to set the view to an unknown view', () => {
            payload = 'aap';

            output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](mockedState, payload);

            expect(output.dataSelection.view).toBeUndefined();
        });

        it('sets isLoading to true', () => {
            payload = 'LIST';
            mockedState.dataSelection.isLoading = false;

            output = dataSelectionReducers[ACTIONS.SET_DATA_SELECTION_VIEW.id](mockedState, payload);

            expect(output.dataSelection.isLoading).toBe(true);
        });
    });

    describe('NAVIGATE_DATA_SELECTION', () => {
        it('updates the page', () => {
            const mockedState = angular.copy(DEFAULT_STATE);

            mockedState.dataSelection = {
                dataset: 'bag',
                filters: {
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                },
                page: 1
            };

            const output = dataSelectionReducers[ACTIONS.NAVIGATE_DATA_SELECTION.id](mockedState, 4);

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
