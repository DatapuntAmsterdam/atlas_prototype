describe('The detailReducers factory', function () {
    var detailReducers,
        defaultState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_detailReducers_, _DEFAULT_STATE_) {
            detailReducers = _detailReducers_;
            defaultState = _DEFAULT_STATE_;
        });
    });

    describe('FETCH_DETAIL', function () {
        it('sets the api endpoint for detail', function () {
            var payload = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                output;

            output = detailReducers.FETCH_DETAIL(defaultState, payload);

            expect(output.detail.endpoint).toBe('https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/');
        });

        it('sets loading indicators for map and detail', function () {
            var payload = 'bag/thing/123/',
                output;

            output = detailReducers.FETCH_DETAIL(defaultState, payload);

            expect(output.detail.isLoading).toBe(true);
            expect(output.map.isLoading).toBe(true);
        });

        it('removes highlights from the map', function () {
            var payload = 'bag/thing/123/',
                inputState = angular.copy(defaultState),
                output;

            inputState.map.highlight = {some: 'object'};

            output = detailReducers.FETCH_DETAIL(inputState, payload);
            expect(output.map.highlight).toBeNull();
        });

        it('disables layer selection, search, page, straatbeeld and dataSelection', function () {
            var payload = 'bag/thing/123/',
                inputState = angular.copy(defaultState),
                output;

            inputState.map.showLayerSelection = true;
            inputState.search = {some: 'object'};
            inputState.page = 'somePage';
            inputState.straatbeeld = {some: 'object'};
            inputState.dataSelection = {some: 'object'};

            output = detailReducers.FETCH_DETAIL(inputState, payload);

            expect(output.map.showLayerSelection).toBe(false);
            expect(output.search).toBeNull();
            expect(output.page).toBeNull();
            expect(output.straatbeeld).toBeNull();
            expect(output.dataSelection).toBeNull();
        });

        it('disables the fullscreen mode off the map', function () {
            var payload = 'bag/thing/123/',
                inputState = angular.copy(defaultState),
                output;

            inputState.map.isFullscreen = true;

            output = detailReducers.FETCH_DETAIL(inputState, payload);

            expect(output.map.isFullscreen).toBe(false);
        });
    });

    describe('SHOW_DETAIL', function () {
        var stateAfterFetchDetail = {
                map: {
                    baseLayer: 'topografie',
                    overlays: [],
                    viewCenter: [52.3719, 4.9012],
                    zoom: 12,
                    showLayerSelection: false,
                    isLoading: true
                },
                search: null,
                page: null,
                detail: {
                    uri: 'bag/thing/123/',
                    geometry: null,
                    isLoading: true
                },
                straatbeeld: null
            },
            payload = {some: 'object'};

        it('stores the geometry in the detail state', function () {
            var output = detailReducers.SHOW_DETAIL(stateAfterFetchDetail, payload);

            expect(output.detail.geometry).toEqual({some: 'object'});
        });

        it('removes loading indicators for map and detail', function () {
            var output = detailReducers.SHOW_DETAIL(stateAfterFetchDetail, payload);

            expect(output.map.isLoading).toBe(false);
            expect(output.detail.isLoading).toBe(false);
        });

        it('does nothing when detail is null', function () {
            //This can happen when a user triggers another action after FETCH_DETAIL and before SHOW_DETAIL
            var output;

            expect(defaultState.detail).toBeNull();
            output = detailReducers.SHOW_DETAIL(defaultState, payload);
            expect(output.detail).toBeNull();
        });
    });
});