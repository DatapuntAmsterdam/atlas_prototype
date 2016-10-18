(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpPage')
        .factory('dpPageDocumentTitle', dpPageDocumentTitleFactory);

    dpPageDocumentTitleFactory.$inject = ['dpUppercaseFirstLetterFilter'];

    function dpPageDocumentTitleFactory (dpUppercaseFirstLetterFilter) {
        return {
            getTitle: getTitle
        };

        function getTitle (pageName) {
            var output;

            if (pageName === 'home') {
                output = null;
            } else {
                output = pageName
                // Make the first letter of each word uppercase
                    .split('-').map(word => dpUppercaseFirstLetterFilter(word))
                    // Replace dashed (-) with spaces
                    .join(' ');
            }

            return output;
        }
    }
})();
