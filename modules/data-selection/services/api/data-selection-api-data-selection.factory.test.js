describe('The dataSelectionApiDataSelection factory', function () {
    let $rootScope,
        $q,
        dataSelectionApiDataSelection,
        api,
        mockedApiResponse,
        config;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection',
            {
                api: {
                    getByUri: function () {
                        let q = $q.defer();

                        q.resolve(mockedApiResponse);

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

        angular.mock.inject(function (_$rootScope_, _$q_, _dataSelectionApiDataSelection_, _api_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            dataSelectionApiDataSelection = _dataSelectionApiDataSelection_;
            api = _api_;
        });

        config = {
            MAX_AVAILABLE_PAGES: 100,
            ENDPOINT_PREVIEW: 'zwembaden/',
            ENDPOINT_DETAIL: 'api_endpoint/zwembaden/',
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
                    id: '3'
                }
            ],
            page_count: 2
        };

        spyOn(api, 'getByUri').and.callThrough();
    });

    it('calls the api factory with the active filters and page as searchParams', function () {
        // Without active filters
        dataSelectionApiDataSelection.query(config, {}, 1);
        expect(api.getByUri).toHaveBeenCalledWith('zwembaden/', {page: 1});

        // With active filters
        dataSelectionApiDataSelection.query(config, {water: 'Verwarmd'}, 1);
        expect(api.getByUri).toHaveBeenCalledWith('zwembaden/', {
            water: 'Verwarmd',
            page: 1
        });

        // With another page
        dataSelectionApiDataSelection.query(config, {water: 'Verwarmd'}, 27);
        expect(api.getByUri).toHaveBeenCalledWith('zwembaden/', {
            water: 'Verwarmd',
            page: 27
        });

        // With yet another page
        let output;
        dataSelectionApiDataSelection.query(config, {}, 9999).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();
        expect(output.data.length).toBe(0);
    });

    it('returns the total number of pages', function () {
        let output;

        dataSelectionApiDataSelection.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.numberOfPages).toBe(2);
    });

    describe('the formatFilters process', function () {
        it('orders the filters based on the configuration', function () {
            let output = {};

            dataSelectionApiDataSelection.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                type: {
                    numberOfOptions: 2,
                    options: [
                        {
                            id: 'Buitenbad',
                            label: 'Buitenbad',
                            count: 4
                        },
                        {
                            id: 'Overdekt',
                            label: 'Overdekt',
                            count: 2
                        }
                    ]
                },
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'Tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'Verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }, {
                            id: 'Koud',
                            label: 'Koud',
                            count: 1
                        }
                    ]
                }
            });
        });

        it('won\'t return filters from the configuration that are not part of the API\'s response', function () {
            let output = {};

            // With only one filter in the API response
            delete mockedApiResponse.aggs_list.type;

            dataSelectionApiDataSelection.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                water: {
                    numberOfOptions: 3,
                    options: [
                        {
                            id: 'Tropisch',
                            label: 'Tropisch',
                            count: 1
                        }, {
                            id: 'Verwarmd',
                            label: 'Verwarmd',
                            count: 4
                        }, {
                            id: 'Koud',
                            label: 'Koud',
                            count: 1
                        }
                    ]
                }
            });
        });
    });

    it('processes the results correctly', function () {
        let output = {};

        dataSelectionApiDataSelection.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.data.length).toEqual(3);
        expect(output.data[0]).toEqual({
            _links: {
                self: {
                    href: 'https://api.amsterdam.nl/api_endpoint/zwembaden/1/'
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
                    href: 'https://api.amsterdam.nl/api_endpoint/zwembaden/2/'
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
                    href: 'https://api.amsterdam.nl/api_endpoint/zwembaden/3/'
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
