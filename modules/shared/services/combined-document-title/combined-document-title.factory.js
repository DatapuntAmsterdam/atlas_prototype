import * as mapDocumentTitle from '../../../../src/map/services/document-title/document-title';

(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpShared')
        .factory('dpCombinedDocumentTitle', documentTitleFactory);

    documentTitleFactory.$inject = [
        'dpDataSelectionDocumentTitle',
        '$q'
    ];

    function documentTitleFactory (
        dpDataSelectionDocumentTitle,
        $q
    ) {
        return {
            getTitle: getTitle
        };

        function getTitle (fullState) {
            const q = $q.defer();
            const filters = fullState.filters;

            mapDocumentTitle.getTitle(fullState).then(result => {
                if (fullState.dataSelection && fullState.dataSelection.view.length) {
                    q.resolve(`${dpDataSelectionDocumentTitle.getTitle(fullState.dataSelection, filters)} | ${result}`);
                } else {
                    q.resolve(result);
                }
            });

            return q.promise;
        }
    }
})();
