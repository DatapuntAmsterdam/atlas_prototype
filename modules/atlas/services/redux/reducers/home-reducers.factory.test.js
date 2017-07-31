describe('The homeReducers factory', () => {
    var homeReducers,
        DEFAULT_STATE,
        mockedStates = [],
        mockedSearchState,
        mockedPageState,
        mockedDetailState,
        mockedStraatbeeldState;

    beforeEach(() => {
        angular.mock.module('atlas');

        angular.mock.inject((_homeReducers_, _stateUrlConverter_) => {
            homeReducers = _homeReducers_;
            DEFAULT_STATE = _stateUrlConverter_.getDefaultState();
        });

        mockedSearchState = angular.copy(DEFAULT_STATE);
        mockedSearchState.search = {
            query: 'I AM A QUERY',
            location: null,
            category: null,
            page: {
                name: null
            }
        };

        mockedPageState = angular.copy(DEFAULT_STATE);
        mockedPageState.page = {
            name: 'over-atlas'
        };

        mockedDetailState = angular.copy(DEFAULT_STATE);
        mockedDetailState.detail = {
            endpoint: 'http://www.example.com/whatever/123/',
            geometry: null,
            isLoading: false,
            page: {
                name: null
            }
        };

        mockedStraatbeeldState = angular.copy(DEFAULT_STATE);
        mockedStraatbeeldState.straatbeeld = {
            id: 123,
            searchLocation: null,
            date: new Date(),
            car: {
                location: [52.789, 4.123],
                heading: 1,
                pitch: 2
            },
            camera: {
                heading: 180,
                pitch: 0
            },
            hotspots: [],
            isLoading: false,
            page: {
                name: null
            }
        };

        mockedStates.push(
            mockedSearchState,
            mockedPageState,
            mockedDetailState,
            mockedStraatbeeldState
        );
    });

    describe('SHOW_HOME', () => {
        it('resets the state to the default', () => {
            mockedStates.forEach(inputState => {
                expect(homeReducers.SHOW_HOME(inputState)).toEqual(DEFAULT_STATE);
            });
        });

        it('keeps the isPrintMode setting', () => {
            mockedStates.forEach(inputState => {
                inputState.atlas.isPrintMode = true;
                expect(homeReducers.SHOW_HOME(inputState).atlas.isPrintMode).toBe(true);

                inputState.atlas.isPrintMode = false;
                expect(homeReducers.SHOW_HOME(inputState).atlas.isPrintMode).toBe(false);
            });
        });

        it('keeps the isEmbedPreview setting', () => {
            mockedStates.forEach(inputState => {
                inputState.atlas.isEmbedPreview = true;
                expect(homeReducers.SHOW_HOME(inputState).atlas.isEmbedPreview).toBe(true);

                inputState.atlas.isEmbedPreview = false;
                expect(homeReducers.SHOW_HOME(inputState).atlas.isEmbedPreview).toBe(false);
            });
        });
    });
});
