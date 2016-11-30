describe('The urlReducers factory', function () {
    var urlReducers,
        mockedState,
        mockedSearchParams;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_urlReducers_, _DEFAULT_STATE_) {
            urlReducers = _urlReducers_;

            mockedState = angular.copy(_DEFAULT_STATE_);
        });

        mockedSearchParams = {
            lat: '52.123',
            lon: '4.789',
            basiskaart: 'topografie',
            zoom: '12',
            pagina: 'welkom'
        };
    });

    describe('URL_CHANGE', function () {
        it('returns the default state when the payload is empty', function () {
            var output = urlReducers.URL_CHANGE({some: 'object'}, {});

            expect(output).toEqual(mockedState);
        });

        describe('search', function () {
            it('can set a query', function () {
                var output;

                mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search.query).toBe('I_AM_A_SEARCH_STRING');
                expect(output.search.location).toBeNull();
            });

            it('can set a location', function () {
                var output;

                mockedSearchParams.zoek = '52.001,4.002';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search.query).toBeNull();
                // Also checking if the strings are converted to numbers.
                expect(output.search.location).toEqual([52.001, 4.002]);
            });

            it('can set an active category', function () {
                var output;

                mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';
                mockedSearchParams.categorie = 'adres';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search.category).toBe('adres');
            });

            describe('isLoading', () => {
                it('is true when the state changes', () => {
                    var output;

                    mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).toBe(true);

                    mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';
                    mockedState.search = {
                        query: 'I_AM_A_DIFFERENT_SEARCH_STRING',
                        location: null,
                        category: null
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).toBe(true);
                });

                it('is unchanged when the state has not changed', () => {
                    var output;

                    // Search query
                    mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';

                    // isLoading is falsy and remains falsy
                    mockedState.search = {
                        query: 'I_AM_A_SEARCH_STRING',
                        location: null,
                        category: null
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).not.toBe(true);

                    // isLoading is false and remains false
                    mockedState.search = {
                        query: 'I_AM_A_SEARCH_STRING',
                        location: null,
                        category: null,
                        isLoading: false
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).not.toBe(true);

                    // isLoading is true and remains true
                    mockedState.search = {
                        query: 'I_AM_A_SEARCH_STRING',
                        location: null,
                        category: null,
                        isLoading: true
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).toBe(true);

                    // Search location
                    mockedSearchParams.zoek = '12.45,56.78';

                    // isLoading is falsy and remains falsy
                    mockedState.search = {
                        query: null,
                        location: [12.45, 56.78],
                        category: null
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).not.toBe(true);

                    // isLoading is false and remains false
                    mockedState.search = {
                        query: null,
                        location: [12.45, 56.78],
                        category: null,
                        isLoading: false
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).not.toBe(true);

                    // isLoading is true and remains true
                    mockedState.search = {
                        query: null,
                        location: [12.45, 56.78],
                        category: null,
                        isLoading: true
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                    expect(output.search.isLoading).toBe(true);
                });
            });

            it('can be null', function () {
                var output;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search).toBeNull();
            });
        });

        describe('map', function () {
            it('sets a baseLayer', function () {
                var output;

                mockedSearchParams.basiskaart = 'luchtfoto_1814';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.baseLayer).toBe('luchtfoto_1814');

                mockedSearchParams.basiskaart = 'topografie';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.baseLayer).toBe('topografie');
            });

            it('can set overlays', function () {
                var output;

                // No overlay
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([]);

                // One overlay
                mockedSearchParams.lagen = 'munitie_opslag:zichtbaar';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([{id: 'munitie_opslag', isVisible: true}]);

                // Two overlays
                mockedSearchParams.lagen = 'munitie_opslag:zichtbaar,geldkluizen:onzichtbaar';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([
                    {id: 'munitie_opslag', isVisible: true},
                    {id: 'geldkluizen', isVisible: false}
                ]);
            });

            it('sets the center', function () {
                var output;

                // Also checking if the strings are converted to numbers.
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.viewCenter).toEqual([52.123, 4.789]);

                mockedSearchParams.lat = '52.789';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.viewCenter).toEqual([52.789, 4.789]);

                mockedSearchParams.lon = '4.123';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.viewCenter).toEqual([52.789, 4.123]);
            });

            it('sets a zoom level', function () {
                var output;

                // Also checking if the strings are converted to numbers.
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.zoom).toBe(12);

                mockedSearchParams.zoom = '16';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.zoom).toBe(16);
            });

            it('sets the showActiveOverlays status', function () {
                var output;

                // With active overlays
                mockedState.map.showActiveOverlays = false;
                mockedSearchParams['actieve-kaartlagen'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showActiveOverlays).toBe(true);

                // Without active overlays
                mockedState.map.showActiveOverlays = true;
                delete mockedSearchParams['actieve-kaartlagen'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showActiveOverlays).toBe(false);
            });

            it('sets the isFullscreen status', function () {
                var output;

                // With full screen enabled
                mockedState.map.isFullscreen = false;
                mockedSearchParams['volledig-scherm'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.isFullscreen).toBe(true);

                // With full screen disabled
                mockedState.map.isFullscreen = true;
                delete mockedSearchParams['volledig-scherm'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.isFullscreen).toBe(false);
            });
        });

        describe('layer selection', function () {
            it('sets the layerSelection status', function () {
                var output;

                // With layer selection
                mockedState.layerSelection = false;
                mockedSearchParams['kaartlagen-selectie'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.layerSelection).toBe(true);

                // Without layer selection
                mockedState.layerSelection = true;
                delete mockedSearchParams['kaartlagen-selectie'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.layerSelection).toBe(false);
            });
        });

        describe('page', function () {
            it('can set a pagina variable', function () {
                var output;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.page).toBe('welkom');

                mockedSearchParams.pagina = 'over-ons';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.page).toBe('over-ons');
            });

            it('will be set to null if there is no page', function () {
                var output;

                mockedSearchParams.pagina = null;
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.page).toBeNull();
            });
        });

        describe('detail', function () {
            it('can set a detail api endpoint', function () {
                var output;

                // Without an active detail page
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.detail).toBeNull();

                // With an active detail page
                mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.detail.endpoint).toBe('https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/');
            });

            it('can restore its invisibility', function () {
                let output;

                mockedSearchParams.detail = 'ABC';
                mockedSearchParams.detailInvisible = true;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.isInvisible).toBe(true);
            });

            it('can restore its invisibility status when not invisible', function () {
                let output;

                mockedSearchParams.detail = 'ABC';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.isInvisible).toBe(false);
            });

            it('remembers the display and geometry of the previous state if the endpoint stays the same', function () {
                var output;

                // With a previous state without an endpoint
                mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.geometry).toBeUndefined();

                // With a previous geometry in the state
                mockedState.detail = {
                    display: 'Mijn lievelings detailpagina',
                    endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                    geometry: 'FAKE_GEOMETRY'
                };
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.display).toBe('Mijn lievelings detailpagina');
                expect(output.detail.geometry).toBe('FAKE_GEOMETRY');
            });

            describe('isLoading', () => {
                it('is true when the endpoint changes', () => {
                    var output;

                    mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                    mockedState.detail = {
                        display: 'Mijn lievelings detailpagina',
                        endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/456/',
                        geometry: 'FAKE_GEOMETRY',
                        isLoading: false
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                    expect(output.detail.isLoading).toBe(true);
                });

                it('is unchanged when the the endpoint stays the same', () => {
                    var output;

                    mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';

                    // isLoading is false and should stay false
                    mockedState.detail = {
                        display: 'Mijn lievelings detailpagina',
                        endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                        geometry: 'FAKE_GEOMETRY',
                        isLoading: false
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                    expect(output.detail.isLoading).not.toBe(true);

                    // isLoading is true and should stay true
                    mockedState.detail = {
                        display: 'Mijn lievelings detailpagina',
                        endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                        geometry: 'FAKE_GEOMETRY',
                        isLoading: true
                    };
                    output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                    expect(output.detail.isLoading).toBe(true);
                });
            });
        });

        describe('straatbeeld', function () {
            it('can be unknown', function () {
                var output;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld).toBeNull();
            });

            it('can be initialized', function () {
                var output;

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.heading = '179';
                mockedSearchParams.pitch = '1';
                mockedSearchParams.fov = '2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.id).toBe('ABC');
                expect(output.straatbeeld.heading).toBe(179);
                expect(output.straatbeeld.pitch).toBe(1);
                expect(output.straatbeeld.fov).toBe(2);
            });

            it('remembers parts of the state that aren\'t in the URL when the ID stays the same', function () {
                var output;
                mockedState.straatbeeld = {};
                mockedState.straatbeeld.id = 'ABC';
                mockedState.straatbeeld.date = new Date('Thu Sep 22 2016 12:10:37 GMT+0200 (CEST)');
                mockedState.straatbeeld.hotspots = [{
                    a: 'a',
                    b: 'b'
                }];
                mockedState.straatbeeld.image = 'http://example.com/example.png';
                mockedState.straatbeeld.location = ['lat', 'lon'];
                mockedState.straatbeeld.isInitial = false;
                mockedState.straatbeeld.isLoading = true;

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.heading = '179';
                mockedSearchParams.pitch = '1';
                mockedSearchParams.fov = '2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.date).toEqual(new Date('Thu Sep 22 2016 12:10:37 GMT+0200 (CEST)'));
                expect(output.straatbeeld.hotspots).toEqual([{
                    a: 'a',
                    b: 'b'
                }]);
                expect(output.straatbeeld.isLoading).toBe(true);
                expect(output.straatbeeld.isInitial).toBe(false);
                expect(output.straatbeeld.location).toEqual(['lat', 'lon']);
                expect(output.straatbeeld.image).toEqual('http://example.com/example.png');
            });

            it('resets all the date and hotspots when the old straatbeeld ID is different than payload', function () {
                var output;

                mockedState.date = new Date('Thu Sep 22 2016 12:10:37 GMT+0200 (CEST)');
                mockedState.hotspots = [{
                    a: 'a',
                    b: 'b',
                    c: 'c',
                    d: 'd'
                }];

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.heading = '179';
                mockedSearchParams.pitch = '1';
                mockedSearchParams.fov = '2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.date).toBeNull();
                expect(output.straatbeeld.hotspots).toEqual([]);
                expect(output.straatbeeld.isLoading).toBe(true);
                expect(output.straatbeeld.isInitial).toBe(true);
            });

            it('can restore its invisibility', function () {
                let output;

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.straatbeeldInvisible = true;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.isInvisible).toBe(true);
            });

            it('can restore its invisibility status when not invisible', function () {
                let output;

                mockedSearchParams.id = 'ABC';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.isInvisible).toBe(false);
            });

            it('can restore its location', function () {
                let output;

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.straatbeeld = '1,2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.location).toEqual([1, 2]);
            });
        });

        describe('dataSelection', function () {
            var mockedSearchParamsWithDataSelection,
                output;

            beforeEach(function () {
                mockedSearchParamsWithDataSelection = angular.copy(mockedSearchParams);

                mockedSearchParamsWithDataSelection.dataset = 'bag';
                mockedSearchParamsWithDataSelection['dataset-filters'] = 'buurtcombinatie:Geuzenbuurt,buurt:Trompbuurt';
                mockedSearchParamsWithDataSelection['dataset-pagina'] = '4';
            });

            it('optionally has a dataset with filters and page numbers', function () {
                // Without an active dataSelection
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.dataSelection).toBeNull();

                // With an active dataSelection
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection).toEqual({
                    view: undefined,
                    dataset: 'bag',
                    filters: jasmine.any(Object),
                    page: jasmine.anything()
                });
            });

            it('maps the filters to an object', function () {
                // With two filters
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.filters).toEqual({
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                });

                // With one filter
                mockedSearchParamsWithDataSelection['dataset-filters'] = 'buurtcombinatie:Geuzenbuurt';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.filters).toEqual({
                    buurtcombinatie: 'Geuzenbuurt'
                });

                // Without filters return an emtpy object
                mockedSearchParamsWithDataSelection['dataset-filters'] = null;
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.filters).toEqual({});
            });

            it('converts the page to a Number', function () {
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.page).not.toBe('4');
                expect(output.dataSelection.page).toBe(4);
            });

            it('decodes the names of active filters', function () {
                mockedSearchParamsWithDataSelection['dataset-filters'] =
                    'buurtcombinatie:Bijlmeer%20Oost%20(D%2CF%2CH),buurt:Belgi%C3%ABplein%20e.o.';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.filters).toEqual({
                    buurtcombinatie: 'Bijlmeer Oost (D,F,H)',
                    buurt: 'Belgiëplein e.o.'
                });
            });

            it('enables list view', function () {
                mockedSearchParamsWithDataSelection.view = 'LIST';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.view).toBe('LIST');
            });

            it('enables table view', function () {
                mockedSearchParamsWithDataSelection.view = 'TABLE';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.view).toBe('TABLE');
            });

            it('enables default view', function () {
                delete mockedSearchParamsWithDataSelection.view;
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.view).toBeUndefined();
            });
        });

        describe('print', function () {
            it('sets whether or not print mode is enabled', function () {
                var output;

                // With print mode enabled
                mockedState.isPrintMode = false;
                mockedSearchParams['print-versie'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.isPrintMode).toBe(true);

                // With print mode disabled
                mockedState.isPrintMode = true;
                delete mockedSearchParams['print-versie'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.isPrintMode).toBe(false);
            });
        });
    });
});
