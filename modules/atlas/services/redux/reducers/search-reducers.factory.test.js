describe('The search-reducers factory', function () {
    var searchReducers,
        defaultState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_searchReducers_, _DEFAULT_STATE_) {
            searchReducers = _searchReducers_;
            defaultState = _DEFAULT_STATE_;
        });
    });

    describe('SHOW_SEARCH_RESULTS_BY_QUERY', function () {
        it('sets the search query and resets the search location and active category', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.search = {
                query: null,
                location: [12.345, 6.789],
                category: 'adres'
            };

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_QUERY(inputState, 'linnaeus');

            expect(output.search.query).toBe('linnaeus');
            expect(output.search.location).toBeNull();
            expect(output.search.category).toBeNull();
        });

        it('removes the highlighted object from the map', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.highlight = {some: 'object'};

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_QUERY(inputState, 'linnaeus');

            expect(output.map.highlight).toBeNull();
        });

        it('hides the layer selection, page, detail, straatbeeld and dataSelection', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.showLayerSelection = true;
            inputState.page = 'somePage';
            inputState.detail = {some: 'object'};
            inputState.staatbeeld = {some: 'object'};
            inputState.dataSelection = {some: 'object'};

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_QUERY(inputState, 'linnaeus');

            expect(output.map.showLayerSelection).toBe(false);
            expect(output.page).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
            expect(output.dataSelection).toBeNull();
        });

        it('disables the fullscreen mode of the map', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.isFullscreen = true;

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_QUERY(inputState, 'linnaeus');

            expect(output.map.isFullscreen).toBe(false);
        });
    });

    describe('SHOW_SEARCH_RESULTS_BY_CLICK', function () {
        it('resets the search query and active category and sets the search location', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.search = {
                query: 'some query',
                location: null,
                category: 'adres'
            };

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);

            expect(output.search.query).toBeNull();
            expect(output.search.location).toEqual([52.001, 4.002]);
            expect(output.search.category).toBeNull();
        });

        it('removes the highlighted object from the map', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.highlight = {some: 'object'};

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);

            expect(output.map.highlight).toBeNull();
        });

        it('hides the layer selection, active overlays, page, detail, straatbeeld and dataSelection', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.showLayerSelection = true;
            inputState.map.showActiveOverlays = true;
            inputState.page = 'somePage';
            inputState.detail = {some: 'object'};
            inputState.staatbeeld = {some: 'object'};
            inputState.dataSelection = {some: 'object'};

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);

            expect(output.map.showLayerSelection).toBe(false);
            expect(output.map.showActiveOverlays).toBe(false);
            expect(output.page).toBeNull();
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
            expect(output.dataSelection).toBeNull();
        });

        it('changes the viewCenter when showLayerSelection or fullscreen mode is enabled', function () {
            var inputState = angular.copy(defaultState),
                output;

            // With fullscreen disabled, it doesn't change the viewCenter
            inputState.map.viewCenter = [52.123, 4.789];
            inputState.map.isFullscreen = false;
            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);

            expect(output.map.viewCenter).toEqual([52.123, 4.789]);

            // With fullscreen enabled, it changes the viewCenter
            inputState.map.isFullscreen = true;
            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);

            expect(output.map.viewCenter).toEqual([52.001, 4.002]);

            // With layer selection enabled
            inputState.map.showLayerSelection = true;
            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);
            expect(output.map.viewCenter).toEqual([52.001, 4.002]);
        });

        it('disables the fullscreen mode of the map', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.map.isFullscreen = true;

            output = searchReducers.SHOW_SEARCH_RESULTS_BY_CLICK(inputState, [52.001, 4.002]);

            expect(output.map.isFullscreen).toBe(false);
        });
    });

    describe('SHOW_SEARCH_RESULTS_CATEGORY', function () {
        it('sets the active category', function () {
            var inputState = angular.copy(defaultState),
                output;

            inputState.search = {
                query: 'Jan Beijerpad',
                location: null,
                category: null
            };

            output = searchReducers.SHOW_SEARCH_RESULTS_CATEGORY(inputState, 'adres');

            expect(output.search.category).toBe('adres');
        });
    });
});
