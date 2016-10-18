(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpLayerSelection')
        .factory('dpLayerSelectionDocumentTitle', dpLayerSelectionDocumentTitleFactory);

    function dpLayerSelectionDocumentTitleFactory () {
        return {
            getTitle: getTitle
        };

        function getTitle () {
            return 'Selecteer kaartlagen';
        }
    }
})();
