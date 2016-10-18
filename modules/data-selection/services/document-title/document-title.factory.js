(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpDataSelection')
        .factory('dpDataSelectionDocumentTitle', dpDataSelectionDocumentTitleFactory);

    dpDataSelectionDocumentTitleFactory.$inject = ['dataSelectionConfig'];

    function dpDataSelectionDocumentTitleFactory (dataSelectionConfig) {
        return {
            getTitle: getTitle
        };

        function getTitle (dataSelectionState) {
            var output,
                variant,
                criteria;

            variant = dataSelectionConfig[dataSelectionState.dataset].TITLE;

            criteria = dataSelectionConfig[dataSelectionState.dataset].FILTERS
                // Retrieve all the active filters
                .filter(function (availableFilter) {
                    return angular.isDefined(dataSelectionState.filters[availableFilter.slug]);
                })
                // Show the value of each active filter
                .map(function (activeFilter) {
                    return dataSelectionState.filters[activeFilter.slug];
                })
                .join(', ');

            output = 'Tabel ' + variant;

            if (criteria.length) {
                output += ' met ' + criteria;
            }

            return output;
        }
    }
})();
