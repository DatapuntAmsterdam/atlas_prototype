(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpDetail')
        .factory('dpDetailDocumentTitle', dpDetailDocumentTitleFactory);

    dpDetailDocumentTitleFactory.$inject = ['endpointParser', 'STELSELPEDIA'];

    function dpDetailDocumentTitleFactory (endpointParser, STELSELPEDIA) {
        return {
            getTitle: getTitle
        };

        function getTitle (detailState) {
            const stelselpediaKey = endpointParser.getStelselpediaKey(detailState.endpoint);

            return `${STELSELPEDIA.DEFINITIONS[stelselpediaKey].label_singular}: ${detailState.display}`;
        }
    }
})();
