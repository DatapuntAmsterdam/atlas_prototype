(function () {
    angular
        .module('dpDataSelection')
        .factory('dataSelectionApi', dataSelectionApiFactory);

    dataSelectionApiFactory.$inject = ['DATA_SELECTION_CONFIG', 'api'];

    function dataSelectionApiFactory (DATA_SELECTION_CONFIG, api) {
        return {
            query: query
        };

        function query (dataset, activeFilters, page) {
            var searchParams = angular.merge(
                {
                    page: page
                },
                activeFilters
            );

            return api.getByUrl(DATA_SELECTION_CONFIG[dataset].ENDPOINT, searchParams).then(function (data) {
                return {
                    filters: formatFilters(dataset, data.aggs_list),
                    tableData: formatTableData(dataset, data.object_list)
                };
            });
        }

        function formatFilters (dataset, rawData) {
            var formattedFilters = angular.copy(DATA_SELECTION_CONFIG[dataset].FILTERS);

            return formattedFilters.filter(function (filter) {
                //Only show the filters that are returned by the API
                return angular.isObject(rawData[filter.slug]);
            }).map(function (filter) {
                //Add all the available options for each filter
                filter.options = rawData[filter.slug].buckets.map(function (option) {
                    return {
                        label: option.key,
                        count: option.doc_count
                    };
                });

                return filter;
            });
        }

        function formatTableData (dataset, rawData) {
            var tableHead,
                tableBody = [];

            tableHead = DATA_SELECTION_CONFIG[dataset].FIELDS.map(function (field) {
                return field.label;
            });

            rawData.forEach(function (rawDataRow) {
                var formattedRow;

                formattedRow = DATA_SELECTION_CONFIG[dataset].FIELDS.map(function (field) {
                    return rawDataRow[field.slug];
                });

                tableBody.push(formattedRow);
            });

            return {
                head: tableHead,
                body: tableBody
            };
        }
    }
})();