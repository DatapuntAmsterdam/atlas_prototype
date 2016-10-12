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

            it('can set a highlight', function () {
                var output;

                // No selectie in the URL
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.highlight).toBeNull();

                // With selectie
                mockedSearchParams.selectie = 'I_AM_A_FAKE_GEOJSON_OBJECT';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.highlight).toBe('I_AM_A_FAKE_GEOJSON_OBJECT');
            });

            it('sets the showLayerSelection status', function () {
                var output;

                // With layer selection
                mockedState.map.showLayerSelection = false;
                mockedSearchParams['kaartlagen-selectie'] = 'aan';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showLayerSelection).toBe(true);

                // Without layer selection
                mockedState.map.showLayerSelection = true;
                delete mockedSearchParams['kaartlagen-selectie'];
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.map.showLayerSelection).toBe(false);
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

            it('remembers the geomtery of the previous state if the endpoint stays the same', function () {
                var output;

                // With a previous state without an endpoint
                mockedSearchParams.detail = 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/';
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.geometry).toBeUndefined();

                // With a previous geometry in the state
                mockedState.detail = {
                    endpoint: 'https://api-acc.datapunt.amsterdam.nl/bag/verblijfsobject/123/',
                    geometry: 'FAKE_GEOMETRY'
                };
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.detail.geometry).toBe('FAKE_GEOMETRY');
            });
        });

        describe('straatbeeld', function () {
            it('can set a straatbeeld by ID', function () {
                var output;

                // Without straatbeeld
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld).toBeNull();

                // With straatbeeld
                mockedSearchParams.id = '12345';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld.id).toBe(12345);
                expect(output.straatbeeld.searchLocation).toBeNull();
            });

            it('can set a straatbeeld by searchLocation', function () {
                var output;

                // Without straatbeeld
                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);
                expect(output.straatbeeld).toBeNull();

                // With straatbeeld
                mockedSearchParams.plat = '52.963';
                mockedSearchParams.plon = '4.741';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.id).toBeNull();
                expect(output.straatbeeld.searchLocation).toEqual([52.963, 4.741]);
            });

            it('will remember the date, car and hotspots if the ID stays the same', function () {
                // Note: these two variables are not part of the URL
                var output;

                mockedState.straatbeeld = {
                    id: 67890,
                    searchLocation: null,
                    date: new Date(1982, 8, 7),
                    car: {
                        location: [52.987, 4.321]
                    },
                    hotspots: ['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_Z']
                };

                mockedSearchParams.id = 67890;
                mockedSearchParams.pagina = null;

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.date).toEqual(new Date(1982, 8, 7));
                expect(output.straatbeeld.car.location).toEqual([52.987, 4.321]);
                expect(output.straatbeeld.hotspots).toEqual(['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_Z']);
            });

            it('can read the heading, pitch and fov from the URL', function () {
                var output;

                mockedState.straatbeeld = {
                    id: 67890,
                    searchLocation: null,
                    date: new Date(1982, 8, 7),
                    car: {
                        location: [52.987, 4.321]
                    },
                    camera: {
                        heading: 1,
                        pitch: 2,
                        fov: 3
                    },
                    hotspots: ['FAKE_HOTSPOT_A', 'FAKE_HOTSPOT_Z']
                };

                mockedSearchParams.id = '67890';
                mockedSearchParams.heading = '7';
                mockedSearchParams.pitch = '8';
                mockedSearchParams.fov = '9';

                output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.camera.heading).toBe(7);
                expect(output.straatbeeld.camera.pitch).toBe(8);
                expect(output.straatbeeld.camera.fov).toBe(9);
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

        describe('has no support for loading indicators', function () {
            beforeEach(function () {
                mockedState.map.isLoading = true;

                mockedState.detail = {
                    uri: 'fake/api/123',
                    isLoading: true
                };

                mockedState.straatbeeld = {
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

            it('sets straatbeeld.isLoading to false if there is a straatbeeld active', function () {
                var output = urlReducers.URL_CHANGE(mockedState, mockedSearchParams);

                expect(output.straatbeeld.isLoading).toBe(false);
            });
        });
    });
});
