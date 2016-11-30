describe('The dataSelectionApi factory', function () {
    let $rootScope,
        $q,
        dataSelectionApi,
        api,
        mockedApiResponse;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                api: {
                    getByUrl: function () {
                        let q = $q.defer();

                        q.resolve(mockedApiResponse);

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.constant('dataSelectionConfig', {
                    MAX_AVAILABLE_PAGES: 100,
                    zwembaden: {
                        ENDPOINT_PREVIEW: 'https://api.amsterdam.nl/zwembaden/',
                        ENDPOINT_DETAIL: 'https://amsterdam.nl/api_endpoint/zwembaden/',
                        PRIMARY_KEY: 'id',
                        FILTERS: [
                            {
                                slug: 'type',
                                label: 'Type accomodatie'
                            }, {
                                slug: 'water',
                                label: 'Watersoort'
                            }
                        ],
                        CONTENT: {
                            TABLE: [
                                {
                                    label: 'Adres',
                                    variables: ['adres']
                                },
                                {
                                    label: 'Openingstijden',
                                    variables: ['openingstijden'],
                                    formatter: 'openingstijdenFormatter'
                                }
                            ],
                            LIST: [
                                {
                                    variables: ['openbare_ruimte', 'huisnummer'],
                                    formatter: 'adres'
                                }, {
                                    variables: ['buurtnaam']
                                }
                            ]
                        }
                    }
                });
            }
        );

        angular.mock.inject(function (_$rootScope_, _$q_, _dataSelectionApi_, _api_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            dataSelectionApi = _dataSelectionApi_;
            api = _api_;
        });

        mockedApiResponse = {
            aggs_list: {
                water: {
                    doc_count: 3,
                    buckets: [
                        {
                            doc_count: 1,
                            key: 'Tropisch'
                        }, {
                            doc_count: 4,
                            key: 'Verwarmd'
                        }, {
                            doc_count: 1,
                            key: 'Koud'
                        }
                    ]
                },
                type: {
                    doc_count: 2,
                    buckets: [
                        {
                            doc_count: 4,
                            key: 'Buitenbad'
                        },
                        {
                            doc_count: 2,
                            key: 'Overdekt'
                        }
                    ]
                }
            },
            object_list: [
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
                    id: '1'
                }
            ],
            page_count: 2
        };

        spyOn(api, 'getByUrl').and.callThrough();
    });

    it('calls the api factory with the active filters and page as searchParams', function () {
        // Without active filters
        dataSelectionApi.query('zwembaden', 'TABLE', {}, 1);
        expect(api.getByUrl).toHaveBeenCalledWith('https://api.amsterdam.nl/zwembaden/', {page: 1});

        // With active filters
        dataSelectionApi.query('zwembaden', 'TABLE', {water: 'Verwarmd'}, 1);
        expect(api.getByUrl).toHaveBeenCalledWith('https://api.amsterdam.nl/zwembaden/', {
            water: 'Verwarmd',
            page: 1
        });

        // With another page
        dataSelectionApi.query('zwembaden', 'TABLE', {water: 'Verwarmd'}, 27);
        expect(api.getByUrl).toHaveBeenCalledWith('https://api.amsterdam.nl/zwembaden/', {
            water: 'Verwarmd',
            page: 27
        });

        // With yet another page
        let output;
        dataSelectionApi.query('zwembaden', 'TABLE', {}, 9999).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();
        expect(output.data.body.length).toBe(0);
    });

    it('returns the total number of pages', function () {
        let output;

        dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.number_of_pages).toBe(2);
    });

    describe('it returns all available filters', function () {
        it('orders the filters based on the configuration', function () {
            let output = {};

            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual([
                {
                    slug: 'type',
                    label: 'Type accomodatie',
                    numberOfOptions: 2,
                    options: [
                        {
                            label: 'Buitenbad',
                            count: 4
                        },
                        {
                            label: 'Overdekt',
                            count: 2
                        }
                    ]
                }, {
                    slug: 'water',
                    label: 'Watersoort',
                    numberOfOptions: 3,
                    options: [
                        {
                            label: 'Tropisch',
                            count: 1
                        }, {
                            label: 'Verwarmd',
                            count: 4
                        }, {
                            label: 'Koud',
                            count: 1
                        }
                    ]
                }
            ]);
        });

        it('won\'t return filters from the configuration that are not part of the API\'s response', function () {
            let output = {};

            // With both filters in the response
            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters.length).toBe(2);
            expect(output.filters[0].slug).toBe('type');
            expect(output.filters[1].slug).toBe('water');

            // With only one filter in the API response
            delete mockedApiResponse.aggs_list.type;

            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters.length).toBe(1);
            expect(output.filters[0].slug).toBe('water');
        });

        it('returns the number of results per category (e.g. there a 12 buurten)', function () {
            let output = {};

            // With both filters in the response
            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters[0].slug).toBe('type');
            expect(output.filters[0].numberOfOptions).toBe(2);

            expect(output.filters[1].slug).toBe('water');
            expect(output.filters[1].numberOfOptions).toBe(3);
        });
    });

    describe('it returns the data', function () {
        it('has a single row for the head of the table based on the configuration', function () {
            let output;

            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.data.head).toEqual(['Adres', 'Openingstijden']);
        });

        it('reorders the results per row from the API to match the order of the configuration', function () {
            let output = {};

            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.data.body.length).toBe(3);
            expect(output.data.body[0]).toEqual({
                detailEndpoint: 'https://amsterdam.nl/api_endpoint/zwembaden/1/',
                content: [
                    [{
                        key: 'adres',
                        value: 'Sneeuwbalweg 24'
                    }], [{
                        key: 'openingstijden',
                        value: 'Alleen op dinsdag'
                    }]
                ]
            });
            expect(output.data.body[1]).toEqual({
                detailEndpoint: 'https://amsterdam.nl/api_endpoint/zwembaden/2/',
                content: [
                    [{
                        key: 'adres',
                        value: 'Marnixstraat 1'
                    }], [{
                        key: 'openingstijden',
                        value: 'Ligt er een beetje aan'
                    }]
                ]
            });
        });

        it('returns the formatters for each group of variables', function () {
            let output;

            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.data.formatters).toEqual([undefined, 'openingstijdenFormatter']);
        });

        it('uses different dataset configuration depending on the view', function () {
            let outputTable,
                outputList;

            dataSelectionApi.query('zwembaden', 'TABLE', {}, 1).then(function (_output_) {
                outputTable = _output_;
            });

            dataSelectionApi.query('zwembaden', 'LIST', {}, 1).then(function (_output_) {
                outputList = _output_;
            });
            $rootScope.$apply();

            expect(outputTable).not.toEqual(outputList);
        });
    });
});
