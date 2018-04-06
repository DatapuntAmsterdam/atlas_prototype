import mockedApiResponseJson from './data-selection-api-dcatd.factory.test.response';

describe('The dataSelectionApiDcatd factory', function () {
    let $rootScope,
        $q,
        dataSelectionApiDcatd,
        api,
        mockedApiResponse,
        config,
        catalogFilters;

    beforeEach(function () {
        angular.mock.module(
            'dpDataSelection', {
                api: {
                    getByUri: function (url) {
                        const q = $q.defer();
                        if (url === 'dcatd/reject') {
                            q.reject();
                        } else {
                            q.resolve(mockedApiResponse);
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
            ENDPOINT_PREVIEW: 'dcatd/datasets',
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
                slug: 'owner',
                label: 'Gepubliceerd door'
            }]
        };

        catalogFilters = {
            groupTypes: [{
                id: 'id',
                label: 'label'
            }],
            formatTypes: [{
                id: 'id',
                label: 'label'
            }],
            serviceTypes: [{
                id: 'id',
                label: 'label'
            }],
            resourceTypes: [{
                id: 'id',
                label: 'label'
            }],
            ownerTypes: [{
                id: 'id',
                label: 'label'
            }],
            licenseTypes: [{
                id: 'id',
                label: 'label'
            }]
        };

        mockedApiResponse = {
            ...mockedApiResponseJson
        };
        spyOn(api, 'getByUri').and.callThrough();
    });

    it('doesn\'t call the api factory when no parameters are provided', function () {
        dataSelectionApiDcatd.query(config, {}, 1);
        expect(api.getByUri).not.toHaveBeenCalled();
    });

    it('calls the api factory with theme parameter and searchText', function () {
        // With an active filter and search text
        dataSelectionApiDcatd.query(config, {
            groups: 'energie'
        }, 1, 'searchText', undefined, catalogFilters);
        expect(api.getByUri).toHaveBeenCalledWith(config.ENDPOINT_PREVIEW, {
            offset: 0,
            limit: config.MAX_ITEMS_PER_PAGE,
            '/properties/dcat:theme/items': 'eq=theme:energie',
            q: 'searchText'
        });
    });

    it('calls the api factory with active filters and searchText', function () {
        // With active filters
        dataSelectionApiDcatd.query(config, {
            groups: 'energie',
            data_format: 'application/pdf'
        }, 1, 'searchText', undefined, catalogFilters);
        expect(api.getByUri).toHaveBeenCalledWith(config.ENDPOINT_PREVIEW, {
            offset: 0,
            limit: config.MAX_ITEMS_PER_PAGE,
            '/properties/dcat:theme/items': 'eq=theme:energie',
            '/properties/dcat:distribution/items/properties/dct:format': 'eq=application/pdf',
            q: 'searchText'
        });

        api.getByUri.calls.reset();

        // With another page
        dataSelectionApiDcatd.query(config, {}, 2, 'searchText', undefined, catalogFilters);
        expect(api.getByUri).toHaveBeenCalledWith(config.ENDPOINT_PREVIEW, {
            offset: 2,
            limit: config.MAX_ITEMS_PER_PAGE,
            q: 'searchText'
        });
    });

    it('calls the api factory with owner parameter and searchText', function () {
        // With an active filter and search text
        dataSelectionApiDcatd.query(config, {
            owner: 'owner'
        }, 1, 'searchText', undefined, catalogFilters);
        expect(api.getByUri).toHaveBeenCalledWith(config.ENDPOINT_PREVIEW, {
            offset: 0,
            limit: config.MAX_ITEMS_PER_PAGE,
            '/properties/ams:owner': 'eq=owner',
            q: 'searchText'
        });
    });

    it('returns the total number of pages', function () {
        let output;

        dataSelectionApiDcatd.query(config, {}, 1, '', undefined, catalogFilters).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.numberOfPages).toBe(2);
    });

    it('registers an error with an unsuccessful API call', () => {
        let thenCalled = false,
            catchCalled = false;

        config.ENDPOINT_PREVIEW = 'dcatd/reject';

        dataSelectionApiDcatd.query(config, {}, 1, '', undefined, catalogFilters).then(() => {
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

        mockedApiResponse['dcat:dataset'] = [];

        dataSelectionApiDcatd.query(config, {}, 1, '', undefined, catalogFilters).then(() => {
            thenCalled = true;
        }, () => {
            catchCalled = true;
        });
        $rootScope.$apply();

        expect(thenCalled).toBe(false);
        expect(catchCalled).toBe(true);
    });

    it('processes the results correctly', function () {
        let output = {};

        dataSelectionApiDcatd.query(config, {}, 1, '', undefined, catalogFilters).then(function (_output_) {
            output = _output_;
        });
        $rootScope.$apply();

        expect(output.data.length).toEqual(4);
        expect(output.data[0]).toEqual({
            '@id': 'ams-dcatd: 642f15c7-8368-4795-9e3d-1a87fa7e562a',
            'dct:description': '<p>Alle activiteiten in Amsterdam en omgeving...</p>',
            'dct:identifier': '642f15c7-8368-4795-9e3d-1a87fa7e562a',
            'dct:title': 'Activiteiten',
            '_links': {
                'self': {
                    'href': 'https://api.amsterdam.nl/dcatd/datasets/642f15c7-8368-4795-9e3d-1a87fa7e562a'
                }
            }
        });
    });

    xdescribe('the formatFilters process', function () {
        it('orders the filters based on the configuration', function () {
            let output = {};

            dataSelectionApiDcatd.query(config, {}, 1, '', undefined, catalogFilters).then(function (_output_) {
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
            }, 1, '', undefined, catalogFilters).then(function (_output_) {
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
