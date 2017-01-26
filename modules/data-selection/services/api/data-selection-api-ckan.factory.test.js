describe('The dataSelectionApiCkan factory', function () {
    let $rootScope,
        $q,
        dataSelectionApiCkan,
        api,
        mockedApiResponse,
        config;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                api: {
                    getByUri: function (url) {
                        let q = $q.defer();

                        if (url === 'catalogus/reject') {
                            q.reject();
                        } else {
                            q.resolve(mockedApiResponse);
                        }

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.constant('API_CONFIG', {
                    ROOT: 'https://api.amsterdam.nl/'
                });
            }
        );

        angular.mock.inject(function (_$rootScope_, _$q_, _dataSelectionApiCkan_, _api_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            dataSelectionApiCkan = _dataSelectionApiCkan_;
            api = _api_;
        });

        config = {
            MAX_ITEMS_PER_PAGE: 2,
            ENDPOINT_PREVIEW: 'catalogus/',
            ENDPOINT_DETAIL: 'api_endpoint/catalogus/',
            PRIMARY_KEY: 'id',
            FILTERS: [
                {
                    slug: 'type',
                    label: 'Type accomodatie'
                }, {
                    slug: 'water',
                    label: 'Watersoort'
                }
            ]
        };

        mockedApiResponse = {
            success: true,
            result: {
                search_facets: {
                    water: {
                        items: [
                            {
                                count: 1,
                                name: 'tropisch',
                                display_name: 'Tropisch'
                            }, {
                                count: 4,
                                name: 'verwarmd',
                                display_name: 'Verwarmd'
                            }, {
                                count: 1,
                                name: 'extra-koud',
                                display_name: 'Extra koud'
                            }
                        ]
                    },
                    type: {
                        items: [
                            {
                                count: 4,
                                name: 'buitenbad',
                                display_name: 'Buitenbad'
                            },
                            {
                                count: 2,
                                name: 'overdekt',
                                display_name: 'Overdekt'
                            }
                        ]
                    }
                },
                results: [
                    {
                        _openbare_ruimte_naam: 'Binnenkant',
                        huisletter: 'A',
                        huisnummer: '1',
                        huisnummer_toevoeging: '2',
                        ligplaats_id: '',
                        standplaats_id: '0123456',
                        openingstijden: 'Alleen op dinsdag',
                        adres: 'Sneeuwbalweg 24',
                        id: '1'
                    }, {
                        _openbare_ruimte_naam: 'Binnenkant',
                        huisletter: 'B',
                        huisnummer: '1',
                        huisnummer_toevoeging: '',
                        ligplaats_id: '0123456',
                        standplaats_id: '',
                        hoofdadres: 'False',
                        status_id: '18',
                        adres: 'Marnixstraat 1',
                        openingstijden: 'Ligt er een beetje aan',
                        id: '2'
                    }, {
                        _openbare_ruimte_naam: 'Binnenkant',
                        huisletter: 'C',
                        huisnummer: '1',
                        huisnummer_toevoeging: '2',
                        ligplaats_id: '',
                        standplaats_id: '0123456',
                        hoofdadres: 'True',
                        status_id: '16',
                        openingstijden: 'Alleen op dinsdag',
                        adres: 'Sneeuwbalweg 24',
                        id: '3'
                    }
                ],
                count: 3
            }
        };

        spyOn(api, 'getByUri').and.callThrough();
    });

    it('calls the api factory with available filters, active filters and offset as searchParams', function () {
        // Without active filters
        dataSelectionApiCkan.query(config, {}, 1);
        expect(api.getByUri).toHaveBeenCalledWith('catalogus/', {
            start: 0,
            'facet.field': '["type","water"]',
            fq: '',
            sort: 'name asc'
        });

        api.getByUri.calls.reset();

        // With an active filter and search text
        dataSelectionApiCkan.query(config, {water: 'verwarmd'}, 1, 'searchText');
        expect(api.getByUri).toHaveBeenCalledWith('catalogus/', {
            start: 0,
            'facet.field': '["type","water"]',
            fq: 'water:"verwarmd"',
            q: 'searchText',
            sort: 'name asc'
        });

        api.getByUri.calls.reset();

        // With active filters
        dataSelectionApiCkan.query(config, {water: 'verwarmd', type: 'overdekt'}, 1);
        expect(api.getByUri).toHaveBeenCalledWith('catalogus/', {
            start: 0,
            'facet.field': '["type","water"]',
            fq: 'water:"verwarmd" type:"overdekt"',
            sort: 'name asc'
        });

        api.getByUri.calls.reset();

        // With another page
        dataSelectionApiCkan.query(config, {water: 'extra-koud'}, 2);
        expect(api.getByUri).toHaveBeenCalledWith('catalogus/', {
            start: 2,
            'facet.field': '["type","water"]',
            fq: 'water:"extra-koud"',
            sort: 'name asc'
        });
    });

    it('returns the total number of pages', function () {
        let output;

        dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.numberOfPages).toBe(2);
    });

    it('registers an error with an unsuccessful API call', () => {
        let thenCalled = false,
            catchCalled = false;

        config.ENDPOINT_PREVIEW += 'reject';

        dataSelectionApiCkan.query(config, {}, 1).then(() => {
            thenCalled = true;
        }, () => {
            catchCalled = true;
        });
        $rootScope.$apply();

        expect(thenCalled).toBe(false);
        expect(catchCalled).toBe(true);
    });

    it('registers an error with an unsuccessful response', () => {
        let thenCalled = false,
            catchCalled = false;

        mockedApiResponse.success = false;

        dataSelectionApiCkan.query(config, {}, 1).then(() => {
            thenCalled = true;
        }, () => {
            catchCalled = true;
        });
        $rootScope.$apply();

        expect(thenCalled).toBe(false);
        expect(catchCalled).toBe(true);
    });

    describe('the formatFilters process', function () {
        it('orders the filters based on the configuration', function () {
            let output = {};

            dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                type: {
                    numberOfOptions: 2,
                    options: [
                        {
                            id: 'buitenbad',
                            label: 'Buitenbad',
                            count: 4
                        },
                        {
                            id: 'overdekt',
                            label: 'Overdekt',
                            count: 2
                        }
                    ]
                },
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'extra-koud',
                            label: 'Extra koud',
                            count: 1
                        },
                        {
                            id: 'tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }
                    ]
                }
            });
        });

        it('optionally applies a formatter to the display value', function () {
            let output = {};

            config.FILTERS[0].formatter = 'lowercase';
            dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                type: {
                    numberOfOptions: 2,
                    options: [
                        {
                            id: 'buitenbad',
                            label: 'Buitenbad'.toLowerCase(),
                            count: 4
                        },
                        {
                            id: 'overdekt',
                            label: 'Overdekt'.toLowerCase(),
                            count: 2
                        }
                    ]
                },
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'extra-koud',
                            label: 'Extra koud',
                            count: 1
                        },
                        {
                            id: 'tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }
                    ]
                }
            });
        });

        it('won\'t return filters from the configuration that are not part of the API\'s response', function () {
            let output = {};

            // With only one filter in the API response
            delete mockedApiResponse.result.search_facets.type;

            dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'extra-koud',
                            label: 'Extra koud',
                            count: 1
                        }, {
                            id: 'tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }
                    ]
                }
            });
        });
    });

    it('processes the results correctly', function () {
        let output = {};

        dataSelectionApiCkan.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.data.length).toEqual(3);
        expect(output.data[0]).toEqual({
            _links: {
                self: {
                    href: 'https://api.amsterdam.nl/api_endpoint/catalogus/?id=1'
                }
            },
            _openbare_ruimte_naam: 'Binnenkant',
            huisletter: 'A',
            huisnummer: '1',
            huisnummer_toevoeging: '2',
            ligplaats_id: '',
            standplaats_id: '0123456',
            openingstijden: 'Alleen op dinsdag',
            adres: 'Sneeuwbalweg 24',
            id: '1'
        });
        expect(output.data[1]).toEqual({
            _links: {
                self: {
                    href: 'https://api.amsterdam.nl/api_endpoint/catalogus/?id=2'
                }
            },
            _openbare_ruimte_naam: 'Binnenkant',
            huisletter: 'B',
            huisnummer: '1',
            huisnummer_toevoeging: '',
            ligplaats_id: '0123456',
            standplaats_id: '',
            hoofdadres: 'False',
            status_id: '18',
            adres: 'Marnixstraat 1',
            openingstijden: 'Ligt er een beetje aan',
            id: '2'
        });
        expect(output.data[2]).toEqual({
            _links: {
                self: {
                    href: 'https://api.amsterdam.nl/api_endpoint/catalogus/?id=3'
                }
            },
            _openbare_ruimte_naam: 'Binnenkant',
            huisletter: 'C',
            huisnummer: '1',
            huisnummer_toevoeging: '2',
            ligplaats_id: '',
            standplaats_id: '0123456',
            hoofdadres: 'True',
            status_id: '16',
            openingstijden: 'Alleen op dinsdag',
            adres: 'Sneeuwbalweg 24',
            id: '3'
        });
    });
});
