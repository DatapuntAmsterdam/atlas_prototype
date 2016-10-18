describe('The geosearch factory', function () {
    var $q,
        $rootScope,
        geosearch,
        api,
        geosearchFormatter,
        searchFormatter,
        mockedSearchResultsWithRadius,
        mockedSearchResultsWithoutRadius,
        mockedEmptySearchResults,
        mockedPandSearchResult,
        mockedFormattedSearchResults,
        mockedFormattedPandSearchResult,
        mockedPandApiResults,
        mockedVerblijfsobjectenApiResults,
        mockedFormattedVerblijfsobjectenApiResults;

    beforeEach(function () {
        angular.mock.module(
            'dpSearchResults',
            {
                api: {
                    getByUri: function (endpoint) {
                        var q = $q.defer();

                        if (endpoint === 'endpoint/with-radius/') {
                            q.resolve(mockedSearchResultsWithRadius);
                        } else if (endpoint === 'other/endpoint/') {
                            q.resolve(mockedSearchResultsWithoutRadius);
                        } else {
                            q.resolve(mockedEmptySearchResults);
                        }

                        return q.promise;
                    },
                    getByUrl: function (endpoint) {
                        // Used to retrieve the pand data and related verblijfsobjecten
                        var q = $q.defer();

                        if (endpoint === 'https://api.datapunt.amsterdam.nl/bag/pand/0456789/') {
                            q.resolve(mockedPandApiResults);
                        } else if (endpoint === 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/?panden__id=04' +
                            '56789') {
                            q.resolve(mockedVerblijfsobjectenApiResults);
                        }

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.constant('SEARCH_CONFIG', {
                    COORDINATES_ENDPOINTS: [
                        {
                            uri: 'endpoint/with-radius/',
                            radius: 50
                        }, {
                            uri: 'other/endpoint/',
                            radius: null
                        }, {
                            uri: 'endpoint-with-no-results/',
                            radius: null
                        }
                    ]
                });
            }
        );

        angular.mock.inject(function (_$q_, _$rootScope_, _geosearch_, _api_, _geosearchFormatter_, _searchFormatter_) {
            $q = _$q_;
            $rootScope = _$rootScope_;
            geosearch = _geosearch_;
            api = _api_;
            geosearchFormatter = _geosearchFormatter_;
            searchFormatter = _searchFormatter_;
        });

        mockedEmptySearchResults = {
            type: 'FeatureCollection',
            features: []
        };

        mockedSearchResultsWithRadius = {
            type: 'FeatureCollection',
            features: [
                {
                    properties: {
                        display: '12981535',
                        id: '12981535',
                        type: 'meetbouten/meetbout',
                        uri: 'https://api.datapunt.amsterdam.nl/meetbouten/meetbout/12981535/'
                    }
                }
            ]
        };

        mockedSearchResultsWithoutRadius = {
            type: 'FeatureCollection',
            features: [
                {
                    properties: {
                        display: 'De Pijp / Rivierenbuurt',
                        id: 'DX12',
                        type: 'gebieden/gebiedsgerichtwerken',
                        uri: 'https://api.datapunt.amsterdam.nl/gebieden/gebiedsgerichtwerken/DX12/'
                    }
                }, {
                    properties: {
                        display: 'Nieuwe Pijp',
                        id: '3630012052060',
                        type: 'gebieden/buurtcombinatie',
                        uri: 'https://api.datapunt.amsterdam.nl/gebieden/buurtcombinatie/3630012052060/'
                    }
                }, {
                    properties: {
                        display: 'Zuid',
                        id: '03630011872038',
                        type: 'gebieden/stadsdeel',
                        uri: 'https://api.datapunt.amsterdam.nl/gebieden/stadsdeel/03630011872038/'
                    }
                }, {
                    properties: {
                        display: 'Willibrordusbuurt',
                        id: '03630000000788',
                        type: 'gebieden/buurt',
                        uri: 'https://api.datapunt.amsterdam.nl/gebieden/buurt/03630000000788/'
                    }
                }, {
                    properties: {
                        display: 'Amstel',
                        id: '03630011950509',
                        opr_type: 'Water',
                        type: 'bag/openbareruimte',
                        uri: 'https://api.datapunt.amsterdam.nl/bag/openbareruimte/03630011950509/'
                    }
                }, {
                    properties: {
                        display: 'ASD14R06669G0000',
                        id: 'NL.KAD.OnroerendeZaak.11550666970000',
                        type: 'kadaster/kadastraal_object',
                        uri: 'https://api.datapunt.amsterdam.nl/brk/object/NL.KAD.OnroerendeZaak.11550666970000/'
                    }
                }
            ]
        };

        mockedFormattedSearchResults = [
            {
                slug: null,
                count: 2,
                results: [
                    {
                        endpoint: 'http://www.some-domain.com/path/to/1/',
                        label: 'Some label #1'
                    }, {
                        endpoint: 'http://www.some-domain.com/path/to/2/',
                        label: 'Some label #2'
                    }
                ]
            }, {
                slug: null,
                count: 1,
                results: [
                    {
                        endpoint: 'http://www.some-domain.com/path/to/3/',
                        label: 'Some label #3'
                    }
                ]
            }
        ];

        mockedPandSearchResult = {
            properties: {
                display: '0456789',
                id: '0456789',
                type: 'bag/pand',
                uri: 'https://api.datapunt.amsterdam.nl/bag/pand/456789/'
            }
        };

        mockedFormattedPandSearchResult = {
            slug: 'pand',
            count: 1,
            results: [
                {
                    endpoint: 'https://api.datapunt.amsterdam.nl/bag/pand/0456789/',
                    label: '0456789'
                }
            ]
        };

        mockedPandApiResults = {
            _links: {
                self: {
                    href: 'https://api.datapunt.amsterdam.nl/bag/pand/0456789/'
                }
            },
            verblijfsobjecten: {
                href: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/?panden__id=0456789'
            }
        };

        mockedVerblijfsobjectenApiResults = {
            count: 2,
            results: ['FAKE_VBO_RESULT_1', 'FAKE_VBO_RESULT_2']
        };

        mockedFormattedVerblijfsobjectenApiResults = {
            label_singular: 'Adres',
            label_plural: 'Adressen',
            slug: 'adres',
            count: 4,
            results: [
                {
                    label: 'Amsteldijk 32-1',
                    endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630000567203/',
                    subtype: null
                },
                {
                    label: 'Amsteldijk 32-2',
                    endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630000567204/',
                    subtype: null
                },
                {
                    label: 'Amsteldijk 32-3',
                    endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630000567205/',
                    subtype: null
                },
                {
                    label: 'Ceintuurbaan 263',
                    endpoint: 'https://api.datapunt.amsterdam.nl/bag/verblijfsobject/03630000602864/',
                    subtype: null
                }
            ],
            useIndenting: false,
            next: null
        };

        spyOn(api, 'getByUri').and.callThrough();
        spyOn(api, 'getByUrl').and.callThrough();
        spyOn(geosearchFormatter, 'format').and.returnValue(mockedFormattedSearchResults);
        spyOn(searchFormatter, 'formatCategory').and.returnValue(mockedFormattedVerblijfsobjectenApiResults);
    });

    it('retrieves formatted data based on a location', function () {
        var searchResults;

        geosearch.search([52.789, 4.987]).then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        expect(api.getByUri).toHaveBeenCalledTimes(3);

        expect(api.getByUri).toHaveBeenCalledWith('endpoint/with-radius/', { lat: 52.789, lon: 4.987, radius: 50 });
        expect(api.getByUri).toHaveBeenCalledWith('other/endpoint/', { lat: 52.789, lon: 4.987 });
        expect(api.getByUri).toHaveBeenCalledWith('endpoint-with-no-results/', { lat: 52.789, lon: 4.987 });

        expect(geosearchFormatter.format).toHaveBeenCalledWith([
            mockedSearchResultsWithRadius,
            mockedSearchResultsWithoutRadius,
            mockedEmptySearchResults
        ]);

        expect(searchResults).toEqual(mockedFormattedSearchResults);
    });

    it('loads related verblijfsobjecten if a pand has been found', function () {
        var searchResults,
            expectedSearchResults;

        // Insert a pand into the mocked result set
        mockedSearchResultsWithoutRadius.features.splice(4, 0, mockedPandSearchResult);
        mockedFormattedSearchResults.splice(1, 0, mockedFormattedPandSearchResult);

        expectedSearchResults = angular.copy(mockedFormattedSearchResults);
        expectedSearchResults.splice(2, 0, mockedFormattedVerblijfsobjectenApiResults);

        geosearch.search([52.789, 4.987]).then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        expectedSearchResults[2].useIndenting = true;
        expectedSearchResults[2].more = {
            label: 'Bekijk alle 2 adressen binnen dit pand',
            endpoint: 'https://api.datapunt.amsterdam.nl/bag/pand/0456789/'
        };

        expect(api.getByUrl).toHaveBeenCalledTimes(2);
        expect(api.getByUrl)
            .toHaveBeenCalledWith('https://api.datapunt.amsterdam.nl/bag/pand/0456789/');
        expect(api.getByUrl)
            .toHaveBeenCalledWith('https://api.datapunt.amsterdam.nl/bag/verblijfsobject/?panden__id=0456789');

        expect(searchFormatter.formatCategory).toHaveBeenCalledWith('adres', mockedVerblijfsobjectenApiResults);
        expect(searchResults).toEqual(expectedSearchResults);
    });

    it('sometimes a pand has no related verblijfsobjecten', function () {
        var searchResults;

        mockedVerblijfsobjectenApiResults = {
            count: 0,
            results: []
        };

        // Insert a pand into the mocked result set
        mockedSearchResultsWithoutRadius.features.splice(4, 0, mockedPandSearchResult);
        mockedFormattedSearchResults.splice(1, 0, mockedFormattedPandSearchResult);

        geosearch.search([52.789, 4.987]).then(function (_searchResults_) {
            searchResults = _searchResults_;
        });

        $rootScope.$apply();

        expect(searchResults).toEqual(mockedFormattedSearchResults);
    });
});
