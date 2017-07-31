((() => {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApi', dataSelectionApiFactory);

    dataSelectionApiFactory.$inject = ['$injector', 'DATA_SELECTION_CONFIG', 'api', 'user', 'TabHeader'];

    function dataSelectionApiFactory ($injector, DATA_SELECTION_CONFIG, api, user, TabHeader) {
        return {
            query,
            getMarkers,
            initialize
        };

        function initialize () {
            TabHeader.provideCounter('FETCH_DATA_SELECTION', queryCount);
        }

        function queryCount (payload) {
            return query(payload.dataset, payload.view, payload.filters, payload.page, payload.query, [])
                .then(results => results.numberOfRecords);
        }

        function query (dataset, view, activeFilters, page, searchText, geometryFilter) {
            const customApi = DATA_SELECTION_CONFIG.datasets[dataset].CUSTOM_API;
            const apiService = $injector.get(customApi);

            return apiService.query(
                DATA_SELECTION_CONFIG.datasets[dataset],
                filterUnavailableFilters(dataset, activeFilters),
                page,
                searchText,
                geometryFilter
            ).then(data => ({
                numberOfPages: data.numberOfPages,
                numberOfRecords: data.numberOfRecords,
                filters: formatFilters(dataset, data.filters),
                data: formatData(dataset, view, data.data)
            }));
        }

        function formatFilters (dataset, rawData) {
            const formattedFilters = angular.copy(DATA_SELECTION_CONFIG.datasets[dataset].FILTERS);

            return formattedFilters.filter(filter => // Only show the filters that are returned by the API
            angular.isObject(rawData[filter.slug])).map(filter => angular.extend({}, filter, rawData[filter.slug]));
        }

        function formatData (dataset, view, rawData) {
            // Filter on fields allowed by current authorization level
            const config = DATA_SELECTION_CONFIG.datasets[dataset].CONTENT[view];
            const fields = config.filter((column) => {
                return !column.authLevel || user.meetsRequiredLevel(column.authLevel);
            });

            return {
                head: fields.map(item => item.label),
                body: rawData.map(rawDataRow => {
                    return {
                        detailEndpoint: rawDataRow._links.self.href,
                        content: fields.map(item => {
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
                formatters: fields.map(item => item.formatter),
                templates: fields.map(item => item.template),
                sensored: config.length !== fields.length
            };
        }

        function recurGetContent (path, rawData) {
            if (path.length === 1) {
                const key = path[0],
                    rawValue = rawData[key];

                return angular.isArray(rawValue)
                    ? rawValue.filter(angular.identity).join(' | ')
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
                .then(data => data.object_list
                .map(object => object._source.centroid)
                .filter(angular.identity)
                .map(([lon, lat]) => [lat, lon]));
        }

        function filterUnavailableFilters (dataset, activeFilters) {
            // Filter out the filters that are not used in the current dataset
            // Filtering is done based on the configured possible filters.
            const activeAndAvailableFilters = angular.copy(activeFilters);

            // Filter activeFilters that are not available for this dataset
            Object.keys(activeFilters).forEach(activeFilterKey => {
                const isAvailable = DATA_SELECTION_CONFIG.datasets[dataset].FILTERS.filter(filter => {
                    return activeFilterKey === filter.slug;
                }).length === 1;

                if (!isAvailable && angular.isUndefined(activeFilters.shape)) {
                    delete activeAndAvailableFilters[activeFilterKey];
                }
            });

            return activeAndAvailableFilters;
        }
    }
}))();
