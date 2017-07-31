((() => {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpDataSelection')
        .factory('dpDataSelectionDocumentTitle', dpDataSelectionDocumentTitleFactory);

    dpDataSelectionDocumentTitleFactory.$inject = ['DATA_SELECTION_CONFIG', 'lowercaseFilter'];

    function dpDataSelectionDocumentTitleFactory (DATA_SELECTION_CONFIG, lowercaseFilter) {
        return {
            getTitle: getTitle
        };

        // TODO: Might be worth replacing with more advanced templating that allows conditions like Mustache (#3335)
        // eslint-disable-next-line complexity
        function getTitle (dataSelectionState) {
            let output,
                view,
                variant,
                markers,
                criteria;

            const VIEW_NAMES = {
                TABLE: 'Tabel',
                LIST: 'Lijst',
                CARDS: 'Datasets'
            };

            if (dataSelectionState.view === 'CARDS' && Object.keys(dataSelectionState.filters).length === 0) {
                if (dataSelectionState.query) {
                    return `Datasets met '${dataSelectionState.query}'`;
                } else {
                    return 'Datasets';
                }
            } else {
                view = VIEW_NAMES[dataSelectionState.view];
                variant = lowercaseFilter(DATA_SELECTION_CONFIG.datasets[dataSelectionState.dataset].TITLE);
                markers = dataSelectionState.geometryFilter.markers || [];
                criteria = DATA_SELECTION_CONFIG.datasets[dataSelectionState.dataset].FILTERS
                // Retrieve all the active filters
                    .filter(availableFilter => angular.isDefined(dataSelectionState.filters[availableFilter.slug]))
                    // Show the value of each active filter
                    .map(activeFilter => dataSelectionState.filters[activeFilter.slug])
                    .join(', ');

                output = view;

                if (variant !== 'catalogus') {
                    output += ` ${variant}`;
                }

                if (markers.length || dataSelectionState.query || criteria.length) {
                    output += ' met ';
                }

                if (markers.length) {
                    // NB: Manual replacement of the superscript 2 is required due to improper browser rendering
                    const geometryFilterDescription = dataSelectionState.geometryFilter.description
                            .replace('&sup2;', '²');
                    output += `ingetekend (${geometryFilterDescription})`;
                }

                if (dataSelectionState.query) {
                    output += `'${dataSelectionState.query}'`;
                }

                if ((markers.length && criteria.length) || (dataSelectionState.query && criteria.length)) {
                    output += ', ';
                }

                output += criteria;

                return output;
            }
        }
    }
}))();
