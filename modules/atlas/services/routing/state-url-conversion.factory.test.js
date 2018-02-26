import DRAW_TOOL_CONFIG from '../../../../src/map/services/draw-tool/draw-tool-config';

describe('The state url conversion definition', function () {
    let stateUrlConversion,
        uriStripper;

    beforeEach(function () {
        uriStripper = {
            stripDomain: angular.noop,
            restoreDomain: angular.noop
        };

        angular.mock.module('atlas', { uriStripper });

        spyOn(uriStripper, 'stripDomain');
        spyOn(uriStripper, 'restoreDomain');

        angular.mock.inject(function (_stateUrlConversion_) {
            stateUrlConversion = _stateUrlConversion_;
        });
    });

    describe('The registered state initialisation methods', function () {
        it('initialize a state to the home page and it sets a default map, (only) on an empty payload', function () { // eslint-disable-line
            let state;

            state = stateUrlConversion.onCreate.DEFAULT({}, {}, {}, stateUrlConversion.initialValues);
            expect(state).toEqual({
                page: {
                    name: 'home'
                },
                filters: {},
                user: {
                    accessToken: '',
                    authenticated: false,
                    scopes: [],
                    name: '',
                    error: false
                },
                mapLayers: [],
                mapBaseLayers: {},
                mapSearchResults: [],
                mapSearchResultsByLocation: {},
                mapDetail: {
                    isLoading: false,
                    currentEndpoint: '',
                    byEndpoint: {}
                },
                mapClickLocation: {},
                isMapPreviewPanelVisible: false,
                map: {
                    viewCenter: [52.3731081, 4.8932945],
                    baseLayer: 'topografie',
                    zoom: 11,
                    overlays: [],
                    isLoading: false,
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.NONE,
                    highlight: true,
                    shapeMarkers: 0,
                    shapeDistanceTxt: '',
                    shapeAreaTxt: ''
                },
                ui: {
                    isEmbed: false,
                    isEmbedPreview: false,
                    isMapFullscreen: false,
                    isMapLayersVisible: true,
                    isMapPanelVisible: false,
                    isMapPanelHandleVisible: true,
                    isPrintMode: false
                }
            });

            state = stateUrlConversion.onCreate.DEFAULT({}, {}, {aap: 'noot'}, {});
            expect(state).toEqual({
                page: undefined,
                filters: undefined,
                user: undefined,
                mapLayers: undefined,
                mapBaseLayers: undefined,
                mapSearchResults: undefined,
                mapSearchResultsByLocation: undefined,
                mapDetail: undefined,
                mapClickLocation: undefined,
                isMapPreviewPanelVisible: undefined,
                ui: undefined
            });
        });
    });

    describe('The registered post processing methods', function () {
        describe('The post processing for user', function () {
            it('copies authenticated, accessToken, scopes, name and error from old state', function () {
                const oldState = {
                    authenticated: true,
                    accessToken: 'foo',
                    scopes: ['bar', 'baz'],
                    name: 'unit',
                    error: 'test'
                };
                const newState = {
                    foo: 'bar'
                };

                const result = stateUrlConversion.post.user(oldState, newState);
                expect(result).toEqual({
                    authenticated: true,
                    accessToken: 'foo',
                    scopes: ['bar', 'baz'],
                    name: 'unit',
                    error: 'test'
                });
            });
        });

        describe('The post processing for dataSelection', function () {
            it('copies markers and isLoading from old state and determines fullscreen mode', function () {
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

                stateUrlConversion.post.dataSelection(oldState, newState);
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

                stateUrlConversion.post.dataSelection(oldState, newState);
                expect(newState).toEqual({
                    view: 'TABLE',
                    isFullscreen: true
                });
            });
        });

        describe('The post processing for map', function () {
            it('copies highlight and isLoading from the previous state, but not the drawing mode ', function () {
                // highlight and isLoading and drawingMode
                let oldState = {
                    highlight: false,
                    isLoading: true,
                    shapeMarkers: 0,
                    shapeDistanceTxt: '',
                    shapeAreaTxt: '',
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.DRAW
                };
                let newState = {};

                stateUrlConversion.post.map(oldState, newState);
                expect(newState).toEqual({
                    highlight: false,
                    isLoading: true,
                    shapeMarkers: 0,
                    shapeDistanceTxt: '',
                    shapeAreaTxt: ''
                });

                // only drawingMode
                oldState = {
                    drawingMode: DRAW_TOOL_CONFIG.DRAWING_MODE.NONE
                };
                newState = {};

                stateUrlConversion.post.map(oldState, newState);
                expect(newState).toEqual({
                    highlight: undefined,
                    isLoading: undefined,
                    shapeMarkers: undefined,
                    shapeDistanceTxt: undefined,
                    shapeAreaTxt: undefined
                });

                // only isLoading
                oldState = {
                    isLoading: true
                };
                newState = {};

                stateUrlConversion.post.map(oldState, newState);
                expect(newState).toEqual({
                    highlight: undefined,
                    isLoading: true,
                    shapeMarkers: undefined,
                    shapeDistanceTxt: undefined,
                    shapeAreaTxt: undefined
                });

                // only highlight
                oldState = {
                    highlight: true
                };
                newState = {};

                stateUrlConversion.post.map(oldState, newState);
                expect(newState).toEqual({
                    highlight: true,
                    isLoading: undefined,
                    shapeMarkers: undefined,
                    shapeDistanceTxt: undefined,
                    shapeAreaTxt: undefined
                });

                // no map state at all
                oldState = null;
                newState = {};

                stateUrlConversion.post.map(oldState, newState);
                expect(newState).toEqual({});
            });
        });

        describe('The post processing for ui', function () {
            it('copies highlight and isLoading from the previous state, but not the drawing mode ', function () {
                // isMapPanelHandleVisible
                let oldState = {
                    isMapPanelHandleVisible: true
                };
                let newState = {};

                stateUrlConversion.post.ui(oldState, newState);
                expect(newState).toEqual({
                    isMapPanelHandleVisible: true
                });

                oldState = {
                    isMapPanelHandleVisible: false
                };
                newState = {};

                stateUrlConversion.post.ui(oldState, newState);
                expect(newState).toEqual({
                    isMapPanelHandleVisible: false
                });

                oldState = {};
                newState = {};

                stateUrlConversion.post.ui(oldState, newState);
                expect(newState).toEqual({
                    isMapPanelHandleVisible: undefined
                });

                // no map state at all
                oldState = null;
                newState = {};

                stateUrlConversion.post.ui(oldState, newState);
                expect(newState).toEqual({});
            });
        });

        describe('The post processing for baseLayers', function () {
            it('copies all baseLayers from old state', function () {
                let oldState,
                    newState;

                oldState = {
                    foo: 'bar'
                };
                newState = {
                    foo: 'bar'
                };

                stateUrlConversion.post.mapBaseLayers(oldState, newState);
                expect(newState).toEqual({
                    foo: 'bar'
                });

                oldState = null;
                newState = {
                    foo: 'bar'
                };

                stateUrlConversion.post.mapBaseLayers(oldState, newState);
                expect(newState).toEqual({
                    foo: 'bar'
                });
            });
        });

        describe('The post processing for mapLayers', function () {
            it('copies all baseLayers from old state', function () {
                let oldState,
                    newState;

                oldState = [1, 2];
                newState = [1, 2];

                stateUrlConversion.post.mapLayers(oldState, newState);
                expect(newState).toEqual([1, 2]);

                oldState = null;
                newState = [1, 2];

                stateUrlConversion.post.mapLayers(oldState, newState);
                expect(newState).toEqual([1, 2]);
            });
        });

        describe('The post processing for detail', function () {
            it('copies display, geometry, isLoading and isFullscreen from old state if equal endpoint', function () {
                let newState;

                const oldState = {
                    endpoint: 1,
                    display: 'aap',
                    geometry: 'noot',
                    isLoading: 'mies',
                    isFullscreen: 'wim',
                    skippedSearchResults: true,
                    something: 'else'
                };
                newState = {
                    endpoint: 1
                };

                stateUrlConversion.post.detail(oldState, newState);
                expect(newState).toEqual({
                    endpoint: 1,
                    display: 'aap',
                    geometry: 'noot',
                    isLoading: 'mies',
                    isFullscreen: 'wim',
                    skippedSearchResults: true
                });

                newState = {
                    endpoint: 2
                };

                stateUrlConversion.post.detail(oldState, newState);
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

                stateUrlConversion.post.search(undefined, newState);

                expect(newState).toEqual(oldStateWithQuery);
            });

            it('keeps isLoading and numberOfResults values if the query, location and category stay the same', () => {
                let newState;

                // With query
                newState = angular.copy(oldStateWithQuery);
                stateUrlConversion.post.search(oldStateWithQuery, newState);
                expect(newState).toEqual(oldStateWithQuery);

                // With query and category
                newState = angular.copy(oldStateWithQueryAndCategory);
                stateUrlConversion.post.search(oldStateWithQueryAndCategory, newState);
                expect(newState).toEqual(oldStateWithQueryAndCategory);

                // With location
                newState = angular.copy(oldStateWithLocation);
                stateUrlConversion.post.search(oldStateWithLocation, newState);
                expect(newState).toEqual(oldStateWithLocation);
            });

            it('resets the isLoading and numberOfResults values if the query, location or category changes', () => {
                let newState;

                // When the query changes
                newState = angular.copy(oldStateWithQuery);
                newState.query = 'damrak'; // Instead of 'dam'
                stateUrlConversion.post.search(oldStateWithQuery, newState);
                expect(newState.numberOfResults).toBeNull();
                expect(newState.isLoading).toBe(true);

                // When the category changes
                newState = angular.copy(oldStateWithQueryAndCategory);
                newState.category = null;
                stateUrlConversion.post.search(oldStateWithQueryAndCategory, newState);
                expect(newState.numberOfResults).toBeNull();
                expect(newState.isLoading).toBe(true);

                // When the location changes
                newState = angular.copy(oldStateWithLocation);
                newState.location = [52.999, 4.111];
                stateUrlConversion.post.search(oldStateWithLocation, newState);
                expect(newState.numberOfResults).toBeNull();
                expect(newState.isLoading).toBe(true);
            });
        });

        describe('The post processing for straatbeeld', function () {
            it('copies image, hotspots, data, location, isInitial, isLoading from old state if equal id', function () {
                let newState;

                const oldState = {
                    id: 1,
                    image: 'aap',
                    hotspots: 'noot',
                    date: 'mies',
                    location: 'wim',
                    isLoading: 'teun',
                    something: 'else',
                    targetLocation: 'foo'
                };
                newState = {
                    id: 1
                };

                stateUrlConversion.post.straatbeeld(oldState, newState);
                expect(newState).toEqual({
                    id: 1,
                    image: 'aap',
                    hotspots: 'noot',
                    date: 'mies',
                    location: 'wim',
                    isInitial: false,
                    isLoading: 'teun',
                    targetLocation: 'foo'
                });

                newState = {
                    id: 2
                };

                // target location is always saved
                stateUrlConversion.post.straatbeeld(oldState, newState);
                expect(newState).toEqual({
                    id: 2,
                    targetLocation: 'foo'
                });

                newState = {
                    id: 3
                };

                stateUrlConversion.post.straatbeeld('yoyo', newState);
                expect(newState).toEqual({
                    id: 3
                });
            });
        });
    });

    describe('The registered value getters and setters', function () {
        describe('detail endpoint', () => {
            it('gets the value by separating the domain from the endpoint', () => {
                const value = 'https://root.amsterdam.nl/endpoint';
                const expected = ['ROOT', 'endpoint'];

                uriStripper.stripDomain.and.returnValue(expected);
                const actual = stateUrlConversion.stateVariables.dte.getValue(value);

                expect(actual).toBe(expected);
                expect(uriStripper.stripDomain).toHaveBeenCalledWith(value);
            });

            it('sets the value by joining the domain to the endpoint', () => {
                const value = ['ROOT', 'endpoint'];
                const expected = 'https://root.amsterdam.nl/endpoint';

                uriStripper.restoreDomain.and.returnValue(expected);
                const actual = stateUrlConversion.stateVariables.dte.setValue(value);

                expect(actual).toBe(expected);
                expect(uriStripper.restoreDomain).toHaveBeenCalledWith(value);
            });
        });
    });
});
