(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .factory('searchTitle', searchTitleFactory);
    searchTitleFactory.$inject = ['numberFilter', 'lowercaseFilter', 'coordinatesFilter'];

    function searchTitleFactory (numberFilter, lowercaseFilter, coordinatesFilter) {
        return {
            getTitleData: getTitleData
        };

        function getTitleData (numberOfResults, query, location, category) {
            var title = '',
                subTitle = '';

            if (category) {
                title = numberFilter(numberOfResults) + ' ' + lowercaseFilter(category);
            } else if (numberOfResults === 0) {
                title = 'Geen resultaten gevonden';
            } else if (numberOfResults === 1) {
                title = '1 resultaat';
            } else if (numberOfResults > 1) {
                title = numberFilter(numberOfResults) + ' resultaten';
            }

            if (query) {
                subTitle += ' "' + query + '"';
            } else if (location) {
                subTitle += ' locatie ' + coordinatesFilter(location);
            }

            if (subTitle) {
                subTitle = 'met ' + subTitle;
            }

            return {
                title: title,
                subTitle: subTitle
            };
        }
    }
})();
