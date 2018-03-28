import mockedApiResponseJson from './data-selection-api-dcatd.factory.test.response';
import mockedApiResponseMetaJson from './data-selection-api-dcatd.factory.test.response.meta';

fdescribe('The dataSelectionApiDcatd factory', function () {
    let $rootScope,
        $q,
        dataSelectionApiDcatd,
        api,
        mockedApiResponse,
        mockedApiResponseMeta,
        config;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection', {
                api: {
                    getByUri: function (url) {
                        const q = $q.defer();

                        if (url === 'dcatd/reject') {
                            q.reject();
                        } else if (url === 'dcatd/openapi') {
                            q.resolve(mockedApiResponseMetaJson);
                        } else {
                            q.resolve(mockedApiResponseJson);
                        }

                        return q.promise;
                    }
                },
                sharedConfig: {
                    API_ROOT: 'https://api.amsterdam.nl/'
                }
            }
        );

        angular.mock.inject(function (_$rootScope_, _$q_, _dataSelectionApiDcatd_, _api_) {
            $rootScope = _$rootScope_;
            $q = _$q_;
            dataSelectionApiDcatd = _dataSelectionApiDcatd_;
            api = _api_;
        });

        config = {
            MAX_ITEMS_PER_PAGE: 2,
            ENDPOINT_PREVIEW: 'dcatd/',
            ENDPOINT_DETAIL: 'dcatd/datasets',
            ENDPOINT_METADATA: 'dcatd/openapi',
            PRIMARY_KEY: 'dct:identifier',
            FILTERS: [{
                slug: 'groups',
                label: 'Thema\'s'
            }, {
                slug: 'data_format',
                label: 'Formaten',
                formatter: 'lowercase'
            }, {
                slug: 'service_type',
                label: 'Service type',
                formatter: 'lowercase'
            }, {
                slug: 'owner',
                label: 'Gepubliceerd door'
            }]
        };

        mockedApiResponse = mockedApiResponseJson;
        mockedApiResponseMeta = mockedApiResponseMetaJson;
        spyOn(api, 'getByUri').and.callThrough();
    });

    fit('calls the api factory with available no parameters', function () {
        // Without active filters
        dataSelectionApiDcatd.query(config, {}, 1);
        expect(api.getByUri).toHaveBeenCalledWith(
            ['dcatd/openapi'],
            ['dcatd/datasets', {
                offset: 0,
                limit: config.MAX_ITEMS_PER_PAGE
            }]
        );

        api.getByUri.calls.reset();
    });

    it('calls the api factory with theme parameter and searchText', function () {
        // With an active filter and search text
        dataSelectionApiDcatd.query(config, {
            groups: 'energie'
        }, 1, 'searchText');
        expect(api.getByUri).toHaveBeenCalledWith('dcatd/openapi');
        expect(api.getByUri).toHaveBeenCalledWith('dcatd/datasets', {
            offset: 0,
            limit: config.MAX_ITEMS_PER_PAGE,
            '/properties/dcat:theme/items': 'eq=theme:energie',
            q: 'searchText'
        });

        api.getByUri.calls.reset();
    });

    it('calls the api factory with active filters and searchText', function () {
        // With active filters
        dataSelectionApiDcatd.query(config, {
            groups: 'energie',
            data_format: 'application/pdf'
        }, 1, 'searchText');
        expect(api.getByUri).toHaveBeenCalledWith('dcatd/', {
            offset: 0,
            limit: config.MAX_ITEMS_PER_PAGE,
            '/properties/dcat:theme/items': 'eq=theme:energie',
            '/properties/dcat:distribution/items/properties/dct:format': 'eq=application/pdf',
            q: 'searchText'
        });

        api.getByUri.calls.reset();

        // With another page
        dataSelectionApiDcatd.query(config, {}, 2, 'searchText');
        expect(api.getByUri).toHaveBeenCalledWith('dcatd/', {
            offset: 2,
            limit: config.MAX_ITEMS_PER_PAGE,
            q: 'searchText'
        });
    });

    it('returns the total number of pages', function () {
        let output;

        dataSelectionApiDcatd.query(config, {}, 1).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.numberOfPages).toBe(2);
    });

    it('registers an error with an unsuccessful API call', () => {
        let thenCalled = false,
            catchCalled = false;

        config.ENDPOINT_PREVIEW += 'reject';

        dataSelectionApiDcatd.query(config, {}, 1).then(() => {
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

        mockedApiResponseJson['dcat:dataset'] = [];

        dataSelectionApiDcatd.query(config, {}, 1).then(() => {
            thenCalled = true;
        }, () => {
            catchCalled = true;
        });
        $rootScope.$apply();

        expect(thenCalled).toBe(false);
        expect(catchCalled).toBe(true);
    });

    sit('processes the results correctly', function () {
        let output = {};

        dataSelectionApiDcatd.query(config, {}, 1).then(function (_output_) {
            output = _output_;
            console.log(JSON.stringify(output.data));
        });
        $rootScope.$apply();

        expect(output.data.length).toEqual(4);
        console.log(JSON.stringify(output.data[0]));
        expect(output.data[0]).toEqual({
            _links: {
                self: {
                    href: 'https://api.amsterdam.nl/dcatd/datasets/642f15c7-8368-4795-9e3d-1a87fa7e562a'
                }
            },
            '@id': 'ams-dcatd:642f15c7-8368-4795-9e3d-1a87fa7e562a',
            'dct:description': '<p>Alle activiteiten in Amsterdam en omgeving...</p>',
            'dct:identifier': '642f15c7-8368-4795-9e3d-1a87fa7e562a',
            'dct:title': 'Activiteiten'
        });
    });

    describe('the formatFilters process', function () {
        it('orders the filters based on the configuration', function () {
            let output = {};

            dataSelectionApiDcatd.query(config, {}, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                groups: {
                    numberOfOptions: 2,
                    options: [{
                        id: 'geografie',
                        label: 'Geografie',
                        count: 1
                    }, {
                        id: 'energie',
                        label: 'Energie',
                        count: 1
                    }]
                },
                data_format: {
                    numberOfOptions: 2,
                    options: [{
                            id: 'application/pdf',
                            label: 'pdf',
                            count: 1
                        },
                        {
                            id: 'text/csv',
                            label: 'csv',
                            count: 1
                        }
                    ]
                }
            });
        });

        it('won\'t return filters from the configuration that are not part of the API\'s response', function () {
            let output = {};

            // With only one filter in the API response
            dataSelectionApiDcatd.query(config, {
                groups: 'energie'
            }, 1).then(function (_output_) {
                output = _output_;
            });
            $rootScope.$apply();

            expect(output.filters).toEqual({
                groups: {
                    numberOfOptions: 2,
                    options: [{
                        id: 'geografie',
                        label: 'Geografie',
                        count: 1
                    }, {
                        id: 'energie',
                        label: 'Energie',
                        count: 1
                    }]
                },
                data_format: {
                    numberOfOptions: 2,
                    options: [{
                            id: 'application/pdf',
                            label: 'pdf',
                            count: 1
                        },
                        {
                            id: 'text/csv',
                            label: 'csv',
                            count: 1
                        }
                    ]
                }
            });
        });
    });
});
