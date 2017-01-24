describe('The pageReducers factory', function () {
    var pageReducers,
        mockedState;

    beforeEach(function () {
        let DEFAULT_STATE = {
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

        angular.mock.module('atlas');

        angular.mock.inject(function (_pageReducers_) {
            pageReducers = _pageReducers_;
            mockedState = angular.copy(DEFAULT_STATE);
        });
    });

    describe('SHOW_PAGE', function () {
        var output;

        it('sets page name', function () {
            output = pageReducers.SHOW_PAGE(mockedState, 'welcome');
            expect(output.page.name).toBe('welcome');

            output = pageReducers.SHOW_PAGE(mockedState, 'goodbye');
            expect(output.page.name).toBe('goodbye');
        });

        it('disables the layer selection, search, detail, straatbeeld and dataSelection', function () {
            mockedState.search = {
                query: 'SOME_QUERY',
                location: null
            };

            mockedState.layerSelection.isEnabled = true;

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
            expect(output.layerSelection.isEnabled).toBe(false);
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
