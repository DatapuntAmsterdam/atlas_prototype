(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApi', dataSelectionApiFactory);

    dataSelectionApiFactory.$inject = ['$injector', 'api', 'dataSelectionConfig'];

    function dataSelectionApiFactory ($injector, api, dataSelectionConfig) {
        return {
            query: query,
            getMarkers: getMarkers
        };

        function query (dataset, view, activeFilters, page) {
            const customApi = dataSelectionConfig[dataset].CUSTOM_API,
                apiService = $injector.get(customApi);

            return apiService.query(dataSelectionConfig[dataset], activeFilters, page)
                .then(function (data) {
                    return {
                        numberOfPages: data.numberOfPages,
                        numberOfRecords: data.numberOfRecords,
                        filters: formatFilters(dataset, data.filters),
                        data: formatData(dataset, view, data.data)
                    };
                });
        }

        function formatFilters (dataset, rawData) {
            const formattedFilters = angular.copy(dataSelectionConfig[dataset].FILTERS);

            return formattedFilters.filter(function (filter) {
                // Only show the filters that are returned by the API
                return angular.isObject(rawData[filter.slug]);
            }).map(function (filter) {
                return angular.extend({}, filter, rawData[filter.slug]);
            });
        }

        function formatData (dataset, view, rawData) {
            return {
                head: dataSelectionConfig[dataset].CONTENT[view]
                    .map(item => item.label),

                body: rawData.map(rawDataRow => {
                    return {
                        detailEndpoint: rawDataRow._links.self.href,
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

        function getMarkers (dataset, activeFilters) {
            return api.getByUrl(dataSelectionConfig[dataset].ENDPOINT_MARKERS, activeFilters).then(function (data) {
                // The .reverse() is needed because the backend (Elastic) stores it's locations in [lon, lat] format
                return data.object_list.map(marker => marker._source.centroid.reverse());
            });
        }
    }
})();
