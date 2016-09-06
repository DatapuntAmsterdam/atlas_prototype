describe('The dataSelectionApi factory', function () {
    var $rootScope,
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
                        var q = $q.defer();

                        q.resolve(mockedApiResponse);

                        return q.promise;
                    }
                }
            },
            function ($provide) {
                $provide.constant('DATA_SELECTION_CONFIG', {
                    zwembaden: {
                        ENDPOINT: 'https://api.amsterdam.nl/zwembaden/',
                        FILTERS: [
                            {
                                slug: 'type',
                                label: 'Type accomodatie'
                            }, {
                                slug: 'water',
                                label: 'Watersoort'
                            }
                        ],
                        FIELDS: [
                            {
                                slug: 'adres',
                                label: 'Adres'
                            }, {
                                slug: 'openingstijden',
                                label: 'Openingstijden'
                            }
                        ]
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
                    openingstijden: 'Alleen op dinsdag',
                    adres: 'Sneeuwbalweg 24'
                }, {
                    adres: 'Marnixstraat 1',
                    openingstijden: 'Ligt er een beetje aan'
                }
            ]
        };

        spyOn(api, 'getByUrl').and.callThrough();
    });

    it('calls the api factory with the active filters and page as searchParams', function () {
        //Without active filters
        dataSelectionApi.query('zwembaden', {}, 1);
        expect(api.getByUrl).toHaveBeenCalledWith('https://api.amsterdam.nl/zwembaden/', {page: 1});

        //With active filters
        dataSelectionApi.query('zwembaden', {water: 'Verwarmd'}, 1);
        expect(api.getByUrl).toHaveBeenCalledWith('https://api.amsterdam.nl/zwembaden/', {
            water: 'Verwarmd',
            page: 1
        });

        //With another page
        dataSelectionApi.query('zwembaden', {water: 'Verwarmd'}, 27);
        expect(api.getByUrl).toHaveBeenCalledWith('https://api.amsterdam.nl/zwembaden/', {
            water: 'Verwarmd',
            page: 27
        });
    });

    describe('it returns all available filters', function () {
        it('orders the filters based on the configuration', function () {
            var output;

            dataSelectionApi.query('zwembaden', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual([
                {
                    slug: 'type',
                    label: 'Type accomodatie',
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
            var output;

            //With both filters in the response
            dataSelectionApi.query('zwembaden', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters.length).toBe(2);
            expect(output.filters[0].slug).toBe('type');
            expect(output.filters[1].slug).toBe('water');


            //With only one filter in the API response
            delete mockedApiResponse.aggs_list.type;

            dataSelectionApi.query('zwembaden', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters.length).toBe(1);
            expect(output.filters[0].slug).toBe('water');
        });

        it('returns the number of results per category (e.g. there a 12 buurten)', function () {
            //Todo: not part of the current API
        });
    });

    describe('it returns the table content', function () {
        it('has a single row for the head of the table based on the configuration', function () {
            var output;

            dataSelectionApi.query('zwembaden', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.tableData.head).toEqual(['Adres', 'Openingstijden']);
        });

        it('reorders the results per row from the API to match the order of the configuration', function () {
            var output;

            dataSelectionApi.query('zwembaden', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.tableData.body.length).toBe(2);
            expect(output.tableData.body[0]).toEqual(['Sneeuwbalweg 24', 'Alleen op dinsdag']);
            expect(output.tableData.body[1]).toEqual(['Marnixstraat 1', 'Ligt er een beetje aan']);
        });

        it('only shows content that is part of the configuration, additional API content will be ignored', function () {
            var output;

            mockedApiResponse.object_list[0].some_variable_we_dont_care_about = 'whatever';
            mockedApiResponse.object_list[1].some_variable_we_dont_care_about = 'sure';

            dataSelectionApi.query('zwembaden', {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.tableData.body.length).toBe(2);
            expect(output.tableData.body[0].length).toBe(2);
            expect(output.tableData.body[1].length).toBe(2);

            expect(JSON.stringify(output.tableData.body)).not.toContain('whatever');
            expect(JSON.stringify(output.tableData.body)).not.toContain('sure');
        });
    });
});