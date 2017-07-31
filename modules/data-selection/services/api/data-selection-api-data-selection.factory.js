((() => {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApiDataSelection', dataSelectionApiDataSelectionFactory);

    dataSelectionApiDataSelectionFactory.$inject = ['sharedConfig', 'api'];

    function dataSelectionApiDataSelectionFactory (sharedConfig, api) {
        return {
            query: query
        };

        function query (config, activeFilters, page, search, geometryFilter) {
            let searchPage = page;

            const shape = (angular.isDefined(geometryFilter)) ? geometryFilter : [];

            // Making sure to not request pages higher then max allowed.
            // If that is the case requesting for page 1, to obtain filters.
            // In the response the data will be dumped.
            if (page > config.MAX_AVAILABLE_PAGES) {
                searchPage = 1;
            }

            const searchParams = angular.merge(
                {
                    page: searchPage,
                    shape: angular.toJson(shape.map(([lat, lng]) => [lng, lat]))
                },
                activeFilters
            );

            return api.getByUri(config.ENDPOINT_PREVIEW, searchParams)
                .then(data => {
                    if (searchPage !== page) {
                        // Requested page was out of api reach, dumping data
                        // and saving only the filters
                        data.object_list = [];
                    }

                    return {
                        numberOfPages: data.page_count,
                        numberOfRecords: data.object_count,
                        filters: formatFilters(data.aggs_list),
                        data: formatData(config, data.object_list)
                    };
                });
        }

        function formatFilters (rawData) {
            return Object.keys(rawData).reduce((filters, key) => {
                filters[key] = {
                    numberOfOptions: rawData[key].doc_count,
                    options: rawData[key].buckets.map(option => {
                        return {
                            id: option.key,
                            label: option.key,
                            count: option.doc_count
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
            return sharedConfig.API_ROOT + config.ENDPOINT_DETAIL +
                rawDataRow[config.PRIMARY_KEY] + '/';
        }
    }
}))();
