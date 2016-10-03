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
            var output = urlReducers.URL_CHANGE({ some: 'object' }, {});

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
                //Also checking if the strings are converted to numbers.
                expect(output.search.location).toEqual([52.001, 4.002]);
            });

            it('can set an active category', function () {
                var output;

                mockedSearchParams.zoek = 'I_AM_A_SEARCH_STRING';
                mockedSearchParams.categorie = 'adres';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.search.category).toBe('adres');
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

                //No overlay
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([]);

                //One overlay
                mockedSearchParams.lagen = 'munitie_opslag:zichtbaar';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([{ id: 'munitie_opslag', isVisible: true }]);

                //Two overlays
                mockedSearchParams.lagen = 'munitie_opslag:zichtbaar,geldkluizen:onzichtbaar';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.overlays).toEqual([
                    { id: 'munitie_opslag', isVisible: true },
                    { id: 'geldkluizen', isVisible: false }
                ]);
            });

            it('sets the center', function () {
                var output;

                //Also checking if the strings are converted to numbers.
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

                //Also checking if the strings are converted to numbers.
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.zoom).toBe(12);

                mockedSearchParams.zoom = '16';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.zoom).toBe(16);
            });

            it('can set a highlight', function () {
                var output;

                //No selectie in the URL
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.highlight).toBeNull();

                //With selectie
                mockedSearchParams.selectie = 'I_AM_A_FAKE_GEOJSON_OBJECT';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.highlight).toBe('I_AM_A_FAKE_GEOJSON_OBJECT');
            });

            it('sets the showLayerSelection status', function () {
                var output;

                //With layer selection
                mockedState.map.showLayerSelection = false;
                mockedSearchParams['kaartlagen-selectie'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showLayerSelection).toBe(true);

                //Without layer selection
                mockedState.map.showLayerSelection = true;
                delete mockedSearchParams['kaartlagen-selectie'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showLayerSelection).toBe(false);
            });

            it('sets the showActiveOverlays status', function () {
                var output;

                //With active overlays
                mockedState.map.showActiveOverlays = false;
                mockedSearchParams['actieve-kaartlagen'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showActiveOverlays).toBe(true);

                //Without active overlays
                mockedState.map.showActiveOverlays = true;
                delete mockedSearchParams['actieve-kaartlagen'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showActiveOverlays).toBe(false);
            });

            it('sets the isFullscreen status', function () {
                var output;

                //With full screen enabled
                mockedState.map.isFullscreen = false;
                mockedSearchParams['volledig-scherm'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.isFullscreen).toBe(true);

                //With full screen disabled
                mockedState.map.isFullscreen = true;
                delete mockedSearchParams['volledig-scherm'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.isFullscreen).toBe(false);
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

                //Without an active detail page
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.detail).toBeNull();

                //With an active detail page
                mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.detail.endpoint).toBe('https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/');
            });

            it('remembers the geomtery of the previous state if the endpoint stays the same', function () {
                var output;

                //With a previous state without an endpoint
                mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.geometry).toBeUndefined();

                //With a previous geometry in the state
                mockedState.detail = {
                    endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                    geometry: 'FAKE_GEOMETRY'
                };
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.geometry).toBe('FAKE_GEOMETRY');
            });
        });

        describe('panorama', function () {

            it('can be unknown', function () {
                var output;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.panorama).toBeNull();
            });
            it('can be initialized', function () {
                var output;

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.heading = '179';
                mockedSearchParams.pitch = '1';
                mockedSearchParams.fov = '2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                
                expect(output.panorama.id).toBe('ABC');
                expect(output.panorama.heading).toBe(179);
                expect(output.panorama.pitch).toBe(1);
                expect(output.panorama.fov).toBe(2);
            });

            it('remember all oldStates when URL changes but panorama remains the same', function() {
                var output;
                mockedState.panorama = {};
                mockedState.panorama.id = 'ABC';
                mockedState.panorama.date = new Date('Thu Sep 22 2016 12:10:37 GMT+0200 (CEST)');
                mockedState.panorama.hotspots = [{
                    a: 'a',
                    b: 'b'
                }];
                mockedState.panorama.image = 'http://example.com/example.png';
                mockedState.panorama.location = ['lat', 'lon'];
                mockedState.panorama.isInitial = false;
                mockedState.panorama.isLoading = true;

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.heading = '179';
                mockedSearchParams.pitch = '1';
                mockedSearchParams.fov = '2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.panorama.date).toEqual(new Date('Thu Sep 22 2016 12:10:37 GMT+0200 (CEST)'));
                expect(output.panorama.hotspots).toEqual([{
                    a: 'a',
                    b: 'b'
                }]);
                expect(output.panorama.isLoading).toBe(true);
                expect(output.panorama.isInitial).toBe(false);
                expect(output.panorama.location).toEqual(['lat', 'lon']);
                expect(output.panorama.image).toEqual('http://example.com/example.png');

            });

            it('resets all oldStates when URL changes but panorama ID is different than payload', function() {
                var output;
                
                mockedState.date = new Date('Thu Sep 22 2016 12:10:37 GMT+0200 (CEST)');
                mockedState.hotspots = [{
                    a: 'a',
                    b: 'b'
                }];

                mockedSearchParams.id = 'ABC';
                mockedSearchParams.heading = '179';
                mockedSearchParams.pitch = '1';
                mockedSearchParams.fov = '2';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.panorama.date).toBeNull();
                expect(output.panorama.hotspots).toEqual([]);
                expect(output.panorama.isLoading).toBe(false);
                expect(output.panorama.isInitial).toBe(true);

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
                //Without an active dataSelection
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.dataSelection).toBeNull();

                //With an active dataSelection
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection).toEqual({
                    dataset: 'bag',
                    filters: jasmine.any(Object),
                    page: jasmine.anything()
                });
            });

            it('maps the filters to an object', function () {
                //With two filters
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.filters).toEqual({
                    buurtcombinatie: 'Geuzenbuurt',
                    buurt: 'Trompbuurt'
                });

                //With one filter
                mockedSearchParamsWithDataSelection['dataset-filters'] = 'buurtcombinatie:Geuzenbuurt';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParamsWithDataSelection);
                expect(output.dataSelection.filters).toEqual({
                    buurtcombinatie: 'Geuzenbuurt'
                });

                //Without filters return an emtpy object
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
        });

        describe('print', function () {
            it('sets whether or not print mode is enabled', function () {
                var output;

                //With print mode enabled
                mockedState.isPrintMode = false;
                mockedSearchParams['print-versie'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.isPrintMode).toBe(true);

                //With print mode disabled
                mockedState.isPrintMode = true;
                delete mockedSearchParams['print-versie'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.isPrintMode).toBe(false);
            });
        });

        describe('has no support for loading indicators', function () {
            beforeEach(function () {
                mockedState.map.isLoading = true;

                mockedState.detail = {
                    uri: 'fake/api/123',
                    isLoading: true
                };

                mockedState.panorama = {
                    id: 12345,
                    camera: {
                        location: null,
                        heading: 11,
                        pitch: 12,
                        fov: 13
                    },
                    isLoading: true
                };

                mockedSearchParams.detail = 'fake/api/123';
                mockedSearchParams.id = '12345';
                mockedSearchParams.heading = '11';
                mockedSearchParams.pitch = '12';
                mockedSearchParams.fov = '13';
            });

            it('sets map.isLoading to false', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.map.isLoading).toBe(false);
            });

            it('sets detail.isLoading to false if there is a detail page active', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.isLoading).toBe(false);
            });

            it('sets panorama.isLoading to false if there is a panorama active', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.panorama.isLoading).toBe(false);
            });
        });
    });
});