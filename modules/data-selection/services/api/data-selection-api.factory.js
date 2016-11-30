(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApi', dataSelectionApiFactory);

    dataSelectionApiFactory.$inject = ['dataSelectionConfig', 'api'];

    function dataSelectionApiFactory (dataSelectionConfig, api) {
        return {
            query: query
        };

        function query (dataset, view, activeFilters, page) {
            let searchParams,
                searchPage = page;

            // Making sure to not request pages higher then max allowed.
            // If that is the case requesting for page 1, to obtain filters.
            // In the response the data will be dumped.
            if (page > dataSelectionConfig.MAX_AVAILABLE_PAGES) {
                searchPage = 1;
            }
            searchParams = angular.merge(
                {
                    page: searchPage
                },
                activeFilters
            );

            return api.getByUrl(dataSelectionConfig[dataset].ENDPOINT_PREVIEW, searchParams).then(function (data) {
                if (searchPage !== page) {
                    // Requested page was out of api reach, dumping data
                    // and saving only the filters
                    data.object_list = [];
                }

                return {
                    number_of_pages: data.page_count,
                    number_of_records: data.object_count,
                    filters: formatFilters(dataset, data.aggs_list),
                    data: formatData(dataset, view, data.object_list)
                };
            });
        }

        function formatFilters (dataset, rawData) {
            const formattedFilters = angular.copy(dataSelectionConfig[dataset].FILTERS);

            return formattedFilters.filter(function (filter) {
                // Only show the filters that are returned by the API
                return angular.isObject(rawData[filter.slug]);
            }).map(function (filter) {
                // Add all the available options for each filter
                filter.options = rawData[filter.slug].buckets.map(function (option) {
                    return {
                        label: option.key,
                        count: option.doc_count
                    };
                });

                // Note: filter.options is limited to 100 results
                filter.numberOfOptions = rawData[filter.slug].doc_count;

                return filter;
            });
        }

        function formatData (dataset, view, rawData) {
            return {
                head: dataSelectionConfig[dataset].CONTENT[view]
                    .map(item => item.label),

                body: rawData.map(rawDataRow => {
                    return {
                        detailEndpoint: getDetailEndpoint(dataset, rawDataRow),
                        content: dataSelectionConfig[dataset].CONTENT[view].map(item => {
                            return item.variables.map(variable => {
                                return {
                                    key: variable,
                                    value: rawDataRow[variable]
                                };
                            });
                        })
                    };
                }),

                formatters: dataSelectionConfig[dataset].CONTENT[view].map(item => item.formatter)
            };
        }

        function getDetailEndpoint (dataset, rawDataRow) {
            return dataSelectionConfig[dataset].ENDPOINT_DETAIL +
                rawDataRow[dataSelectionConfig[dataset].PRIMARY_KEY] + '/';
        }
    }
})();
