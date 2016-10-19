(function () {
    'use strict';

    // This factory name is namespaced because other modules will get a similar service with the same name
    angular
        .module('dpStraatbeeld')
        .factory('dpStraatbeeldDocumentTitle', dpStraatbeeldDocumentTitle);

    dpStraatbeeldDocumentTitle.$inject = ['coordinatesFilter'];

    function dpStraatbeeldDocumentTitle (coordinatesFilter) {
        return {
            getTitle: getTitle
        };

        function getTitle (straatbeeldState) {
            return 'Panorama ' + coordinatesFilter(straatbeeldState.location);
        }
    }
})();
