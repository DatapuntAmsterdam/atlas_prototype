(function () {
    'use strict';

    angular
        .module('atlasSearchResults')
        .component('atlasSearchResultsList', {
            bindings: {
                category: '=',
                limitResults: '='
            },
            templateUrl: 'modules/search-results/components/search-results/list/list.html',
            controller: AtlasSearchResultsListController,
            controllerAs: 'vm'
        });

    function AtlasSearchResultsListController () {
        var vm = this;

        vm.showSubtype = function (categorySlug, link) {
            return angular.isString(link.subtype) &&
                ((categorySlug === 'openbareruimte' && link.subtype !== 'weg') ||
                (categorySlug === 'adres' && link.subtype !== 'verblijfsobject') ||
                categorySlug === 'gebied');
        };
    }
})();
