(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApi', dataSelectionApiFactory);

    dataSelectionApiFactory.$inject = ['dataSelectionConfig', 'api'];

    function dataSelectionApiFactory (dataSelectionConfig, api) {
        return {
            query: query
        };

        function query (dataset, activeFilters, page) {
            var searchParams,
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
                    tableData: formatTableData(dataset, data.object_list)
                };
            });
        }

        function formatFilters (dataset, rawData) {
            var formattedFilters = angular.copy(dataSelectionConfig[dataset].FILTERS);

            return formattedFilters.filter(function (filter) {
                //Only show the filters that are returned by the API
                return angular.isObject(rawData[filter.slug]);
            }).map(function (filter) {
                //Add all the available options for each filter
                filter.options = rawData[filter.slug].buckets.map(function (option) {
                    return {
                        label: option.key,
                        format: option.format,
                        count: option.doc_count
                    };
                });

                //Note: filter.options is limited to 100 results
                filter.numberOfOptions = rawData[filter.slug].doc_count;

                return filter;
            });
        }

        function formatTableData (dataset, rawData) {
            var tableHead,
                tableFormat,
                tableBody;

            tableHead = dataSelectionConfig[dataset].FIELDS.map(function (field) {
                return field.label;
            });

            tableFormat = dataSelectionConfig[dataset].FIELDS.map(function (field) {
                return field.format;
            });

            tableBody = rawData.map(function (rawDataRow) {
                var detailEndpoint;

                detailEndpoint = dataSelectionConfig[dataset].ENDPOINT_DETAIL;
                detailEndpoint += rawDataRow[dataSelectionConfig[dataset].PRIMARY_KEY];
                detailEndpoint += '/';

                return {
                    detailEndpoint: detailEndpoint,
                    fields: dataSelectionConfig[dataset].FIELDS.map(function (field) {
                        return rawDataRow[field.slug];
                    })
                };
            });

            return {
                head: tableHead,
                format: tableFormat,
                body: tableBody
            };
        }
    }
})();
