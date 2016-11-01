(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpPage')
        .factory('dpPageDocumentTitle', dpPageDocumentTitleFactory);

    dpPageDocumentTitleFactory.$inject = ['pageName'];

    function dpPageDocumentTitleFactory (pageName) {
        return {
            getTitle: name => pageName(name)
        };
    }
})();
