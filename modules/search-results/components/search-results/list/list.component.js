(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResultsList', {
            bindings: {
                category: '=',
                limitResults: '='
            },
            templateUrl: 'modules/search-results/components/search-results/list/list.html',
            controller: DpSearchResultsListController,
            controllerAs: 'vm'
        });

    function DpSearchResultsListController () {
        var vm = this;

        vm.showSubtype = function (categorySlug, link) {
            return angular.isString(link.subtype) &&
                ((categorySlug === 'openbareruimte' && link.subtype !== 'weg') ||
                (categorySlug === 'adres' && link.subtype !== 'verblijfsobject') ||
                categorySlug === 'gebied');
        };
    }
})();
