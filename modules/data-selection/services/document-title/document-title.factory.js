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
            let output,
                view,
                variant,
                criteria;

            view = dataSelectionState.view === 'TABLE' ? 'Tabel' : 'Lijst';
            variant = dataSelectionConfig[dataSelectionState.dataset].TITLE;
            criteria = dataSelectionConfig[dataSelectionState.dataset].FILTERS
                // Retrieve all the active filters
                .filter(availableFilter => angular.isDefined(dataSelectionState.filters[availableFilter.slug]))
                // Show the value of each active filter
                .map(activeFilter => dataSelectionState.filters[activeFilter.slug])
                .join(', ');

            output = view + ' ' + variant;

            if (criteria.length) {
                output += ' met ' + criteria;
            }

            return output;
        }
    }
})();
