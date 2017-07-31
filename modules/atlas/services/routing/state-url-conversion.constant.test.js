describe('The state url conversion definition', () => {
    let STATE_URL_CONVERSION,
        DRAW_TOOL_CONFIG;

    beforeEach(() => {
        angular.mock.module('atlas', {});

        angular.mock.inject((_STATE_URL_CONVERSION_, _DRAW_TOOL_CONFIG_) => {
            STATE_URL_CONVERSION = _STATE_URL_CONVERSION_;
            DRAW_TOOL_CONFIG = _DRAW_TOOL_CONFIG_;
        });
    });

    describe('The registered state initialisation methods', () => {
        it('initialize a state to the home page and it sets a default map, (only) on an empty payload', () => {
            let state;

            state = STATE_URL_CONVERSION.onCreate.DEFAULT({}, {}, {}, STATE_URL_CONVERSION.initialValues);
            expect(state).toEqual({
                atlas: {
                    isPrintMode: false,
                    isEmbedPreview: false,
                    isEmbed: false
                },
                page: {
                    name: 'home'
                },
                layerSelection: {
                    isEnabled: false
                },
                map: {
                    viewCenter: [52.3731081, 4.8932945],
                    baseLayer: 'topografie',
                    zoom: 11,
                    overlays: [],
                    isFullscreen: false,
                    isLoading: false,
                    showActiveOverlays: false,
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.NONE
                }
            });

            state = STATE_URL_CONVERSION.onCreate.DEFAULT({}, {}, {aap: 'noot'}, {});
            expect(state).toEqual({atlas: undefined, page: undefined, layerSelection: undefined});
        });
    });

    describe('The registered post processing methods', () => {
        describe('The post processing for dataSelection', () => {
            it('copies markers and isLoading from old state and determines fullscreen mode', () => {
                let oldState,
                    newState;

                oldState = {
                    markers: 'aap',
                    isLoading: 'noot',
                    something: 'else'
                };
                newState = {
                    view: 'LIST'
                };

                STATE_URL_CONVERSION.post.dataSelection(oldState, newState);
                expect(newState).toEqual({
                    markers: 'aap',
                    isLoading: 'noot',
                    view: 'LIST',
                    isFullscreen: false
                });

                oldState = null;
                newState = {
                    view: 'TABLE'
                };

                STATE_URL_CONVERSION.post.dataSelection(oldState, newState);
                expect(newState).toEqual({
                    view: 'TABLE',
                    isFullscreen: true
                });
            });
        });

        describe('The post processing for map', () => {
            it('copies isLoading from the previous state, but not the drawing mode ', () => {
                // isLoading and drawingMode
                let oldState = {
                    isLoading: true,
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW
                };
                let newState = {};

                STATE_URL_CONVERSION.post.map(oldState, newState);
                expect(newState).toEqual({
                    isLoading: true
                });

                // only drawingMode
                oldState = {
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.NONE
                };
                newState = {};

                STATE_URL_CONVERSION.post.map(oldState, newState);
                expect(newState).toEqual({
                    isLoading: undefined
                });

                // only isLoading
                oldState = {
                    isLoading: false
                };
                newState = {};

                STATE_URL_CONVERSION.post.map(oldState, newState);
                expect(newState).toEqual({
                    isLoading: false
                });

                // no map state at all
                oldState = null;
                newState = {};

                STATE_URL_CONVERSION.post.map(oldState, newState);
                expect(newState).toEqual({});
            });
        });

        describe('The post processing for detail', () => {
            it('copies display, geometry, isLoading and isFullscreen from old state if equal endpoint', () => {
                let newState;

                const oldState = {
                    endpoint: 1,
                    display: 'aap',
                    geometry: 'noot',
                    isLoading: 'mies',
                    isFullscreen: 'wim',
                    something: 'else'
                };
                newState = {
                    endpoint: 1
                };

                STATE_URL_CONVERSION.post.detail(oldState, newState);
                expect(newState).toEqual({
                    endpoint: 1,
                    display: 'aap',
                    geometry: 'noot',
                    isLoading: 'mies',
                    isFullscreen: 'wim'
                });

                newState = {
                    endpoint: 2
                };

                STATE_URL_CONVERSION.post.detail(oldState, newState);
                expect(newState).toEqual({
                    endpoint: 2
                });
            });
        });

        describe('The post processing for search', () => {
            const oldStateWithQuery = {
                query: 'dam',
                location: null,
                category: null,
                numberOfResults: 101,
                isLoading: false
            };
            const oldStateWithQueryAndCategory = {
                query: 'dam',
                location: null,
                category: 'adres',
                numberOfResults: 102,
                isLoading: false

            };
            const oldStateWithLocation = {
                query: null,
                location: [52.123, 4.789],
                category: null,
                numberOfResults: 103,
                isLoading: false
            };

            it('does nothing if there is no old search state', () => {
                const newState = angular.copy(oldStateWithQuery);

                STATE_URL_CONVERSION.post.search(undefined, newState);

                expect(newState).toEqual(oldStateWithQuery);
            });

            it('keeps isLoading and numberOfResults values if the query, location and category stay the same', () => {
                let newState;

                // With query
                newState = angular.copy(oldStateWithQuery);
                STATE_URL_CONVERSION.post.search(oldStateWithQuery, newState);
                expect(newState).toEqual(oldStateWithQuery);

                // With query and category
                newState = angular.copy(oldStateWithQueryAndCategory);
                STATE_URL_CONVERSION.post.search(oldStateWithQueryAndCategory, newState);
                expect(newState).toEqual(oldStateWithQueryAndCategory);

                // With location
                newState = angular.copy(oldStateWithLocation);
                STATE_URL_CONVERSION.post.search(oldStateWithLocation, newState);
                expect(newState).toEqual(oldStateWithLocation);
            });

            it('resets the isLoading and numberOfResults values if the query, location or category changes', () => {
                let newState;

                // When the query changes
                newState = angular.copy(oldStateWithQuery);
                newState.query = 'damrak'; // Instead of 'dam'
                STATE_URL_CONVERSION.post.search(oldStateWithQuery, newState);
                expect(newState.numberOfResults).toBeNull();
                expect(newState.isLoading).toBe(true);

                // When the category changes
                newState = angular.copy(oldStateWithQueryAndCategory);
                newState.category = null;
                STATE_URL_CONVERSION.post.search(oldStateWithQueryAndCategory, newState);
                expect(newState.numberOfResults).toBeNull();
                expect(newState.isLoading).toBe(true);

                // When the location changes
                newState = angular.copy(oldStateWithLocation);
                newState.location = [52.999, 4.111];
                STATE_URL_CONVERSION.post.search(oldStateWithLocation, newState);
                expect(newState.numberOfResults).toBeNull();
                expect(newState.isLoading).toBe(true);
            });
        });

        describe('The post processing for straatbeeld', () => {
            it('copies image, hotspots, data, location, isInitial, isLoading from old state if equal id', () => {
                let newState;

                const oldState = {
                    id: 1,
                    image: 'aap',
                    hotspots: 'noot',
                    date: 'mies',
                    location: 'wim',
                    isLoading: 'teun',
                    something: 'else'
                };
                newState = {
                    id: 1
                };

                STATE_URL_CONVERSION.post.straatbeeld(oldState, newState);
                expect(newState).toEqual({
                    id: 1,
                    image: 'aap',
                    hotspots: 'noot',
                    date: 'mies',
                    location: 'wim',
                    isInitial: false,
                    isLoading: 'teun'
                });

                newState = {
                    id: 2
                };

                STATE_URL_CONVERSION.post.straatbeeld(oldState, newState);
                expect(newState).toEqual({
                    id: 2
                });
            });
        });
    });
});
