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
        let vm = this;

        /**
         * watch isLoading and the query and location parameters of the state
         * if isLoading becomes true then find out what has te be loaded and get it
         */
        $scope.$watchGroup(['vm.isLoading', 'vm.query', 'vm.category', 'vm.location'], () => {
            if (vm.isLoading) {
                if (angular.isString(vm.query) && vm.query.length) {
                     // SEARCH BY QUERY
                    searchByQuery(vm.query, vm.category);
                } else if (angular.isArray(vm.location)) {
                     // GEOSEARCH
                    searchByLocation(vm.location);
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

        function searchByQuery (query, category) {
            if (angular.isString(category) && category.length) {
                search.search(query, category).then(setSearchResults);
            } else {
                search.search(query).then(setSearchResults);
            }
        }

        function searchByLocation (location) {
            geosearch.search(location).then(setSearchResults);
        }

        /**
         * For both SEARCH BY QUERY (with and without category) and GEOSEARCH
         */
        function setSearchResults (searchResults) {
            let numberOfResults = searchResults.reduce(function (previous, current) {
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
