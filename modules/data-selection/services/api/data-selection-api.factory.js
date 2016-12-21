(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApi', dataSelectionApiFactory);

    dataSelectionApiFactory.$inject = ['$injector', 'DATA_SELECTION_CONFIG', 'api'];

    function dataSelectionApiFactory ($injector, DATA_SELECTION_CONFIG, api) {
        return {
            query: query,
            getMarkers: getMarkers
        };

        function query (dataset, view, activeFilters, page, searchText) {
            const customApi = DATA_SELECTION_CONFIG[dataset].CUSTOM_API,
                apiService = $injector.get(customApi);

            return apiService.query(DATA_SELECTION_CONFIG[dataset], activeFilters, page, searchText)
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
            const formattedFilters = angular.copy(DATA_SELECTION_CONFIG[dataset].FILTERS);

            return formattedFilters.filter(function (filter) {
                // Only show the filters that are returned by the API
                return angular.isObject(rawData[filter.slug]);
            }).map(function (filter) {
                return angular.extend({}, filter, rawData[filter.slug]);
            });
        }

        function formatData (dataset, view, rawData) {
            return {
                head: DATA_SELECTION_CONFIG[dataset].CONTENT[view]
                    .map(item => item.label),

                body: rawData.map(rawDataRow => {
                    return {
                        detailEndpoint: rawDataRow._links.self.href,
                        content: DATA_SELECTION_CONFIG[dataset].CONTENT[view].map(item => {
                            return item.variables.map(variable => {
                                const path = variable.split('.');
                                return {
                                    key: variable,
                                    value: recurGetContent(path, rawDataRow)
                                };
                            });
                        })
                    };
                }),

                formatters: DATA_SELECTION_CONFIG[dataset].CONTENT[view].map(item => item.formatter),
                templates: DATA_SELECTION_CONFIG[dataset].CONTENT[view].map(item => item.template)
            };
        }

        function recurGetContent (path, rawData) {
            if (path.length === 1) {
                const key = path[0],
                    rawValue = rawData[key];

                return angular.isArray(rawValue)
                    ? rawValue.map(value => value)
                    : rawValue;
            } else {
                const key = path[0],
                    rawValue = rawData[key],
                    remainingPath = path.splice(1);

                return angular.isArray(rawValue)
                    ? rawValue.map(value => recurGetContent(remainingPath, value))
                    : recurGetContent(remainingPath, rawValue);
            }
        }

        function getMarkers (dataset, activeFilters) {
            return api.getByUrl(DATA_SELECTION_CONFIG[dataset].ENDPOINT_MARKERS, activeFilters).then(function (data) {
                // The .reverse() is needed because the backend (Elastic) stores it's locations in [lon, lat] format
                return data.object_list.map(marker => marker._source.centroid.reverse());
            });
        }
    }
})();
