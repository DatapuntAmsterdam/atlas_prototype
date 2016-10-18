(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpMap')
        .factory('dpMapDocumentTitle', dpMapDocumentTitleFactory);

    function dpMapDocumentTitleFactory () {
        return {
            getTitle: getTitle
        };

        function getTitle () {
            return 'Grote kaart';
        }
    }
})();
