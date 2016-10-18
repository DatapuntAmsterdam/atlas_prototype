describe('The pageReducers factory', function () {
    var pageReducers,
        mockedState;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_pageReducers_, _DEFAULT_STATE_) {
            pageReducers = _pageReducers_;
            mockedState = angular.copy(_DEFAULT_STATE_);
        });
    });

    describe('SHOW_PAGE', function () {
        var output;

        it('sets page name', function () {
            output = pageReducers.SHOW_PAGE(mockedState, 'welcome');
            expect(output.page).toBe('welcome');

            output = pageReducers.SHOW_PAGE(mockedState, 'goodbye');
            expect(output.page).toBe('goodbye');
        });

        it('disables the layer selection, search, detail, straatbeeld and dataSelection', function () {
            mockedState.search = {
                query: 'SOME_QUERY',
                location: null
            };

            mockedState.layerSelection = true;

            mockedState.detail = {
                endpoint: 'http://some-endpoint/path/123',
                isLoading: false
            };

            mockedState.straatbeeld = {
                id: 123,
                camera: 'WHATEVER',
                isLoading: false
            };

            mockedState.dataSelection = {
                some: 'object'
            };

            output = pageReducers.SHOW_PAGE(mockedState, 'goodbye');

            expect(output.search).toBeNull();
            expect(output.layerSelection).toBe(false);
            expect(output.detail).toBeNull();
            expect(output.straatbeeld).toBeNull();
            expect(output.dataSelection).toBeNull();
        });

        it('disables the full screen mode of the map', function () {
            mockedState.map.isFullscreen = true;

            output = pageReducers.SHOW_PAGE(mockedState, 'goodbye');
            expect(output.map.isFullscreen).toBe(false);
        });
    });
});
