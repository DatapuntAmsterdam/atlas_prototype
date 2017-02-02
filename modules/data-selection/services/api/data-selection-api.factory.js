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

        function query (dataset, view, activeFilters, page, searchText, geometryFilter) {
            const customApi = DATA_SELECTION_CONFIG.datasets[dataset].CUSTOM_API;
            const apiService = $injector.get(customApi);

            return apiService.query(
                DATA_SELECTION_CONFIG.datasets[dataset],
                filterUnavailableFilters(dataset, activeFilters),
                page,
                searchText,
                geometryFilter
            ).then(function (data) {
                return {
                    numberOfPages: data.numberOfPages,
                    numberOfRecords: data.numberOfRecords,
                    filters: formatFilters(dataset, data.filters),
                    data: formatData(dataset, view, data.data)
                };
            });
        }

        function formatFilters (dataset, rawData) {
            const formattedFilters = angular.copy(DATA_SELECTION_CONFIG.datasets[dataset].FILTERS);

            return formattedFilters.filter(function (filter) {
                // Only show the filters that are returned by the API
                return angular.isObject(rawData[filter.slug]);
            }).map(function (filter) {
                return angular.extend({}, filter, rawData[filter.slug]);
            });
        }

        function formatData (dataset, view, rawData) {
            return {
                head: DATA_SELECTION_CONFIG.datasets[dataset].CONTENT[view]
                    .map(item => item.label),

                body: rawData.map(rawDataRow => {
                    return {
                        detailEndpoint: rawDataRow._links.self.href,
                        content: DATA_SELECTION_CONFIG.datasets[dataset].CONTENT[view].map(item => {
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

                formatters: DATA_SELECTION_CONFIG.datasets[dataset].CONTENT[view].map(item => item.formatter),
                templates: DATA_SELECTION_CONFIG.datasets[dataset].CONTENT[view].map(item => item.template)
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
            return api
                .getByUri(
                    DATA_SELECTION_CONFIG.datasets[dataset].ENDPOINT_MARKERS,
                    filterUnavailableFilters(dataset, activeFilters)
                )
                .then(function (data) {
                    return data.object_list
                        .map(object => object._source.centroid)
                        .map(([lon, lat]) => [lat, lon]);
                });
        }

        function filterUnavailableFilters (dataset, activeFilters) {
            // Some activeFilters do not exist for the current data
            let activeAndAvailableFilters = angular.copy(activeFilters);

            // Filter activeFilters that are not available for this dataset
            Object.keys(activeFilters).forEach(activeFilterKey => {
                let isAvailable = DATA_SELECTION_CONFIG.datasets[dataset].FILTERS.filter(filter => {
                    return activeFilterKey === filter.slug;
                }).length === 1;

                if (!isAvailable) {
                    delete activeAndAvailableFilters[activeFilterKey];
                }
            });

            return activeAndAvailableFilters;
        }
    }
})();
