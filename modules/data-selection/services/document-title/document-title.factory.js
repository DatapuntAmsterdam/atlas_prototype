(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpDataSelection')
        .factory('dpDataSelectionDocumentTitle', dpDataSelectionDocumentTitleFactory);

    dpDataSelectionDocumentTitleFactory.$inject = ['DATA_SELECTION_CONFIG'];

    function dpDataSelectionDocumentTitleFactory (DATA_SELECTION_CONFIG) {
        return {
            getTitle: getTitle
        };

        function getTitle (dataSelectionState) {
            let output,
                view,
                variant,
                criteria;

            const VIEW_NAMES = {
                TABLE: 'Tabel',
                LIST: 'Lijst',
                CARDS: 'Dataset'
            };

            view = VIEW_NAMES[dataSelectionState.view];
            variant = DATA_SELECTION_CONFIG[dataSelectionState.dataset].TITLE;
            criteria = DATA_SELECTION_CONFIG[dataSelectionState.dataset].FILTERS
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
