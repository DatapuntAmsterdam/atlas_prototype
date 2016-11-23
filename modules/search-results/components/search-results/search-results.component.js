(function () {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResults', {
            bindings: {
                isLoading: '=',
                query: '@',
                location: '=',
                category: '@',
                numberOfResults: '='
            },
            templateUrl: 'modules/search-results/components/search-results/search-results.html',
            controller: DpSearchResultsController,
            controllerAs: 'vm'
        });

    DpSearchResultsController.$inject = ['$scope', 'search', 'geosearch', 'store', 'ACTIONS'];

    function DpSearchResultsController ($scope, search, geosearch, store, ACTIONS) {
        var vm = this;

        /**
         * SEARCH BY QUERY
         */
        $scope.$watchGroup(['vm.query', 'vm.category'], function () {
            if (angular.isString(vm.query) && vm.query.length) {
                if (angular.isString(vm.category) && vm.category.length) {
                    search.search(vm.query, vm.category).then(setSearchResults);
                } else {
                    search.search(vm.query).then(setSearchResults);
                }
            }
        });

        vm.loadMore = function () {
            vm.isLoadMoreLoading = true;

            search.loadMore(vm.searchResults[0]).then(function (searchResults) {
                vm.isLoadMoreLoading = false;

                vm.searchResults[0] = searchResults;
            });
        };

        /**
         * GEOSEARCH
         */
        $scope.$watchCollection('vm.location', function (location) {
            if (angular.isArray(location)) {
                geosearch.search(location).then(setSearchResults);
            }
        });

        /**
         * For both SEARCH BY QUERY (with and without category) and GEOSEARCH
         */
        function setSearchResults (searchResults) {
            var numberOfResults = searchResults.reduce(function (previous, current) {
                return previous + current.count;
            }, 0);

            store.dispatch({
                type: ACTIONS.SHOW_SEARCH_RESULTS,
                payload: numberOfResults
            });

            vm.searchResults = searchResults;
            vm.hasLoadMore = function () {
                return angular.isString(vm.category) &&
                    vm.searchResults[0].count > vm.searchResults[0].results.length &&
                    !vm.isLoadMoreLoading;
            };
        }
    }
})();
