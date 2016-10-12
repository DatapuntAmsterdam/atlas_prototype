describe('The homeReducers factory', function () {
    var homeReducers,
        DEFAULT_STATE,
        mockedStates = [],
        mockedSearchState,
        mockedPageState,
        mockedDetailState,
        mockedStraatbeeldState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_homeReducers_, _DEFAULT_STATE_) {
            homeReducers = _homeReducers_;
            DEFAULT_STATE = _DEFAULT_STATE_;
        });

        mockedSearchState = angular.copy(DEFAULT_STATE);
        mockedSearchState.search = {
            query: 'I AM A QUERY',
            location: null,
            category: null
        };
        mockedSearchState.page = null;

        mockedPageState = angular.copy(DEFAULT_STATE);
        mockedPageState.page = 'over-atlas';

        mockedDetailState = angular.copy(DEFAULT_STATE);
        mockedDetailState.detail = {
            endpoint: 'http://www.example.com/whatever/123/',
            geometry: null,
            isLoading: false
        };
        mockedDetailState.page = null;

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
            isLoading: false
        };
        mockedStraatbeeldState.page = null;

        mockedStates.push(
            mockedSearchState,
            mockedPageState,
            mockedDetailState,
            mockedStraatbeeldState
        );
    });

    describe('SHOW_HOME', function () {
        it('resets the state to the default', function () {
            mockedStates.forEach(function (inputState) {
                expect(homeReducers.SHOW_HOME(inputState)).toEqual(DEFAULT_STATE);
            });
        });

        it('keeps the isPrintMode setting', function () {
            mockedStates.forEach(function (inputState) {
                inputState.isPrintMode = false;
                expect(homeReducers.SHOW_HOME(inputState).isPrintMode).toBe(false);

                inputState.isPrintMode = true;
                expect(homeReducers.SHOW_HOME(inputState).isPrintMode).toBe(true);
            });
        });
    });
});
