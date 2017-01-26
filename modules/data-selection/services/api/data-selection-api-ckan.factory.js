(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApiCkan', dataSelectionApiCkanFactory);

    dataSelectionApiCkanFactory.$inject = ['$q', '$filter', 'API_CONFIG', 'api'];

    function dataSelectionApiCkanFactory ($q, $filter, API_CONFIG, api) {
        return {
            query: query
        };

        function query (config, activeFilters, page, searchText) {
            const deferred = $q.defer(),
                searchParams = {
                    start: (page - 1) * config.MAX_ITEMS_PER_PAGE,
                    'facet.field': queryFilters(config.FILTERS),
                    fq: queryActiveFilters(activeFilters),
                    sort: 'name asc'
                };

            if (searchText) {
                // Optional search text
                searchParams.q = searchText;
            }

            api.getByUri(config.ENDPOINT_PREVIEW, searchParams).then(data => {
                if (data.success) {
                    deferred.resolve({
                        numberOfPages: Math.ceil(data.result.count / config.MAX_ITEMS_PER_PAGE),
                        numberOfRecords: data.result.count,
                        filters: formatFilters(data.result.search_facets, config.FILTERS),
                        data: formatData(config, data.result.results)
                    });
                } else {
                    deferred.reject();
                }
            }, deferred.reject);

            return deferred.promise;
        }

        function queryFilters (filters) {
            return '[' + filters.map(filter => {
                return `"${filter.slug}"`;
            }).join(',') + ']';
        }

        function queryActiveFilters (filters) {
            return Object.keys(filters).reduce((queryString, key) => {
                return queryString + (queryString ? ' ' : '') + `${key}:"${filters[key]}"`;
            }, '');
        }

        function formatFilters (rawData, filtersConfig) {
            return Object.keys(rawData).reduce((filters, key) => {
                let items = rawData[key].items;
                let filterConfig = filtersConfig.find(config => config.slug === key);
                if (filterConfig && filterConfig.formatter) {
                    items.forEach(item => item.display_name = $filter(filterConfig.formatter)(item.display_name));
                }
                items.sort((a, b) => a.display_name.localeCompare(b.display_name));
                filters[key] = {
                    numberOfOptions: rawData[key].items.length,
                    options: items.map(option => {
                        return {
                            id: option.name,
                            label: option.display_name,
                            count: option.count
                        };
                    })
                };
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
            return API_CONFIG.ROOT + config.ENDPOINT_DETAIL +
                '?id=' + rawDataRow[config.PRIMARY_KEY];
        }
    }
})();
