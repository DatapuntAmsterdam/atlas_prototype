(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApiDcatd', dataSelectionApiDcatdFactory);

    dataSelectionApiDcatdFactory.$inject = ['$window', '$q', '$filter', 'sharedConfig', 'api'];

    function dataSelectionApiDcatdFactory ($window, $q, $filter, sharedConfig, api) {
        const searchParamTheme = '/properties/dcat:theme/items',
            searchParamFormat = '/properties/dcat:distribution/items/properties/dct:format',
            searchParamOwner = '/properties/ams:owner';

        return {
            query: query
        };

        function query (config, activeFilters, page, searchText = '', geometryFilter = undefined, catalogFilters = {}) {
            const deferred = $q.defer(),
                searchParams = {
                    offset: (page - 1) * config.MAX_ITEMS_PER_PAGE,
                    limit: config.MAX_ITEMS_PER_PAGE
                },
                queryTheme = getQueryTheme(activeFilters),
                queryFormat = getQueryFormat(activeFilters),
                queryOwner = getQueryOwner(activeFilters);

            if (searchText) {
                // Optional search text
                searchParams.q = searchText;
            }

            if (queryTheme !== '') {
                // optional thema/groups filter
                searchParams[searchParamTheme] = queryTheme;
            }

            if (queryFormat !== '') {
                // optional format filter
                searchParams[searchParamFormat] = queryFormat;
            }

            if (queryOwner !== '') {
                // optional owner filter
                searchParams[searchParamOwner] = queryOwner;
            }

            if (Object.keys(catalogFilters).length === 0 && catalogFilters.constructor === Object) {
                deferred.reject();
            } else {
                api.getByUri(config.ENDPOINT_PREVIEW, searchParams).then(data => {
                    const count = data['dcat:dataset'].length;
                    if (count !== 0) {
                        const results = data['dcat:dataset'];
                        deferred.resolve({
                            numberOfPages: Math.ceil(count / config.MAX_ITEMS_PER_PAGE),
                            numberOfRecords: count,
                            filters: formatFilters(results, config, catalogFilters),
                            data: formatData(config, results)
                        });
                    } else {
                        deferred.reject();
                    }
                }, deferred.reject);
            }
            return deferred.promise;
        }

        function getQueryTheme (filters) {
            return Object.keys(filters).reduce((queryString, key) => {
                if (key !== 'groups') return queryString;
                return queryString + `eq=theme:${filters[key]}`;
            }, '');
        }

        function getQueryFormat (filters) {
            return Object.keys(filters).reduce((queryString, key) => {
                if (key !== 'data_format') return queryString;
                return queryString + `eq=${filters[key]}`;
            }, '');
        }

        function getQueryOwner (filters) {
            return Object.keys(filters).reduce((queryString, key) => {
                if (key !== 'owner') return queryString;
                return queryString + `eq=${filters[key]}`;
            }, '');
        }

        function formatFilters (searchParams, filtersConfig, catalogFilters) {
            var filters = {
                groups: {
                    options: []
                },
                data_format: {
                    options: []
                },
                owner: {
                    options: []
                }
            };

            filters.groups = {
                numberOfOptions: catalogFilters.groupTypes.length,
                options: catalogFilters.groupTypes.map(option => {
                    return {
                        id: option.id,
                        label: option.label,
                        count: 1
                    };
                })
            };

            filters.data_format = {
                numberOfOptions: catalogFilters.formatTypes.length,
                options: catalogFilters.formatTypes.map(option => {
                    return {
                        id: option.id,
                        label: option.label,
                        count: 1
                    };
                })
            };

            filters.service_type = {
                numberOfOptions: catalogFilters.serviceTypes.length,
                options: catalogFilters.serviceTypes.map(option => {
                    return {
                        id: option.id,
                        label: option.label,
                        count: 1
                    };
                })
            };

            filters.resource_type = {
                numberOfOptions: catalogFilters.resourceTypes.length,
                options: catalogFilters.resourceTypes.map(option => {
                    return {
                        id: option.id,
                        label: option.label,
                        count: 1
                    };
                })
            };

            filters.owner = {
                numberOfOptions: catalogFilters.ownerTypes.length,
                options: catalogFilters.ownerTypes.map(option => {
                    return {
                        id: option.id,
                        label: option.label,
                        count: 1
                    };
                })
            };

            return Object.keys(filters).reduce((filterString, key) => {
                return filters;
            }, {});
        }

        function formatData (config, rawData) {
            return rawData.map(rawDataRow => {
                rawDataRow._links = {
                    self: {
                        href: getDetailEndpoint(config, rawDataRow)
                    }
                };
                return rawDataRow;
            });
        }

        function getDetailEndpoint (config, rawDataRow) {
            return sharedConfig.API_ROOT + config.ENDPOINT_DETAIL +
                '/' + rawDataRow[config.PRIMARY_KEY];
        }
    }
})();
