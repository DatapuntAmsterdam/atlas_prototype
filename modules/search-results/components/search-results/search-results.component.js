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
        $scope.$watch('vm.isLoading', () => {
            if (vm.isLoading) {
                if (!searchByQuery(vm.query, vm.category)) {
                    searchByLocation(vm.location);
                }
            }
        });

        $scope.$watchGroup(['vm.query', 'vm.category'], () => {
            if (!vm.isLoading) {
                searchByQuery(vm.query, vm.category);
            }
        });

        $scope.$watchCollection('vm.location', () => {
            if (!vm.isLoading) {
                searchByLocation(vm.location);
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
            let isQuery = angular.isString(query) && query.length;
            if (isQuery) {
                if (angular.isString(category) && category.length) {
                    search.search(query, category).then(setSearchResults);
                } else {
                    search.search(query).then(setSearchResults);
                }
            }
            return isQuery;
        }

        function searchByLocation (location) {
            let isLocation = angular.isArray(location);
            if (isLocation) {
                geosearch.search(location).then(setSearchResults);
            }
            return isLocation;
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
