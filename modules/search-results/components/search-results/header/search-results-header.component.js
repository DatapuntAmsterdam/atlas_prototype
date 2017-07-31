((() => {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResultsHeader', {
            bindings: {
                numberOfResults: '=',
                query: '@',
                location: '=',
                category: '@',
                searchResults: '='
            },
            templateUrl: 'modules/search-results/components/search-results/header/search-results-header.html',
            controllerAs: 'vm',
            controller: DpSearchResultsHeaderController
        });

    DpSearchResultsHeaderController.$inject = ['$scope', 'searchTitle'];

    function DpSearchResultsHeaderController ($scope, searchTitle) {
        var vm = this;

        $scope.$watchGroup([
            'vm.numberOfResults',
            'vm.category',
            'vm.query',
            'vm.location',
            'vm.searchResults'
        ], () => {
            var titleData = searchTitle.getTitleData(
                    vm.numberOfResults,
                    vm.query,
                    vm.location,
                    vm.category,
                    vm.searchResults);

            vm.title = titleData.title;
            vm.subTitle = titleData.subTitle;
        });
    }
}))();
