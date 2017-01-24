describe('The detailReducers factory', function () {
    var detailReducers,
        defaultState;

    defaultState = {
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

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_detailReducers_) {
            detailReducers = _detailReducers_;
        });
    });

    describe('FETCH_DETAIL', function () {
        it('sets the api endpoint for detail', function () {
            var payload = 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                output;

            output = detailReducers.FETCH_DETAIL(defaultState, payload);

            expect(output.detail.endpoint).toBe('https://api.datapunt.amsterdam.nl/bag/verblijfsobject/123/');
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

            inputState.detail = {
                geometry: {
                    some: 'object'
                }
            };

            output = detailReducers.FETCH_DETAIL(inputState, payload);
            expect(output.detail.geometry).toBeUndefined();
        });

        it('disables layer selection, search, page, straatbeeld and dataSelection', function () {
            var payload = 'bag/thing/123/',
                inputState = angular.copy(defaultState),
                output;

            inputState.layerSelection.isEnabled = true;
            inputState.search = {some: 'object'};
            inputState.page.name = 'somePage';
            inputState.straatbeeld = {some: 'object'};
            inputState.dataSelection = {some: 'object'};

            output = detailReducers.FETCH_DETAIL(inputState, payload);

            expect(output.layerSelection.isEnabled).toBe(false);
            expect(output.search).toBeNull();
            expect(output.page.name).toBeNull();
            expect(output.straatbeeld).toBeNull();
            expect(output.dataSelection).toBeNull();
        });

        it('disables the fullscreen mode of the map', function () {
            var payload = 'bag/thing/123/',
                inputState = angular.copy(defaultState),
                output;

            inputState.map.isFullscreen = true;

            output = detailReducers.FETCH_DETAIL(inputState, payload);

            expect(output.map.isFullscreen).toBe(false);
        });
        it('sets the reload flag in case the endpoint stays the same', function () {
            var payload = 'bag/thing/123/',
                inputState = angular.copy(defaultState),
                output;

            output = detailReducers.FETCH_DETAIL(inputState, payload);

            expect(output.detail.reload).toBe(false);

            inputState.detail = {
                endpoint: 'bag/thing/123/'
            };
            output = detailReducers.FETCH_DETAIL(inputState, payload);
            expect(output.detail.reload).toBe(true);
            expect(output.detail.endpoint).toBe('bag/thing/123/');
        });
    });

    describe('SHOW_DETAIL', function () {
        var stateAfterFetchDetail = {
                map: {
                    baseLayer: 'topografie',
                    overlays: [],
                    viewCenter: [52.3719, 4.9012],
                    zoom: 12,
                    isLoading: true
                },
                layerSelection: {
                    isEnabled: false
                },
                search: null,
                page: {
                    name: null
                },
                detail: {
                    endpoint: 'bag/thing/123/',
                    isLoading: true
                },
                straatbeeld: null
            },
            payload = {
                display: 'My detail page',
                geometry: {
                    some: 'object'
                }
            };

        it('stores the display and geometry in the detail state', function () {
            var output = detailReducers.SHOW_DETAIL(stateAfterFetchDetail, payload);

            expect(output.detail.display).toBe('My detail page');
            expect(output.detail.geometry).toEqual({some: 'object'});
        });

        it('removes loading indicators for map and detail', function () {
            var output = detailReducers.SHOW_DETAIL(stateAfterFetchDetail, payload);

            expect(output.map.isLoading).toBe(false);
            expect(output.detail.isLoading).toBe(false);
        });

        it('turns the reload flag off', function () {
            stateAfterFetchDetail.detail.reload = true;
            var output = detailReducers.SHOW_DETAIL(stateAfterFetchDetail, payload);

            expect(output.detail.reload).toBe(false);
        });

        it('does nothing when detail is null', function () {
            // This can happen when a user triggers another action after FETCH_DETAIL and before SHOW_DETAIL
            var output;

            expect(defaultState.detail).toBeNull();
            output = detailReducers.SHOW_DETAIL(defaultState, payload);
            expect(output.detail).toBeNull();
        });
    });
});
