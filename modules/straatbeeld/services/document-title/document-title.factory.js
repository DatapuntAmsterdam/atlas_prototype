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
            let title = 'Panorama';
            if (angular.isArray(straatbeeldState.location)) {
                title += ` ${coordinatesFilter(straatbeeldState.location)}`;
            }
            return title;
        }
    }
})();
