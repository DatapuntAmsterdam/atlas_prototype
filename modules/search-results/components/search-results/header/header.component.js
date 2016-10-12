(function () {
    'use strict';

    angular
        .module('atlasSearchResults')
        .component('atlasSearchResultsHeader', {
            bindings: {
                numberOfResults: '=',
                query: '@',
                location: '=',
                category: '@'
            },
            templateUrl: 'modules/search-results/components/search-results/header/header.html',
            controllerAs: 'vm'
        });
})();
