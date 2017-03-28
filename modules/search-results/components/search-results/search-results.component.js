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

    DpSearchResultsController.$inject = ['$rootScope', '$scope', 'search', 'geosearch', 'store', 'user', 'ACTIONS'];

    function DpSearchResultsController ($rootScope, $scope, search, geosearch, store, user, ACTIONS) {
        const vm = this;

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

        // Show warning depending on authorization
        const unwatchAuthorizationLevel = $rootScope.$watch(() => user.getAuthorizationLevel(), updateWarningMessage);
        $rootScope.$on('$destroy', unwatchAuthorizationLevel);

        vm.loadMore = function () {
            vm.isLoadMoreLoading = true;

            search.loadMore(vm.searchResults[0]).then(function (searchResults) {
                vm.isLoadMoreLoading = false;

                vm.searchResults[0] = searchResults;
            });
        };

        function searchByQuery (query, category) {
            const isQuery = angular.isString(query) && query.length;
            if (isQuery) {
                if (angular.isString(category) && category.length) {
                    search.search(query, category).then(setSearchResults).then(updateWarningMessage);
                } else {
                    search.search(query).then(setSearchResults).then(updateWarningMessage);
                }
            }
            return isQuery;
        }

        function searchByLocation (location) {
            const isLocation = angular.isArray(location);
            if (isLocation) {
                geosearch.search(location).then(setSearchResults).then(updateWarningMessage);
            }
            return isLocation;
        }

        function updateWarningMessage () {
            const kadastraleSubject = vm.searchResults &&
                vm.searchResults.find(category => category.slug === 'subject');
            if (kadastraleSubject) {
                if (user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS)) {
                    delete kadastraleSubject.warning;
                } else if (user.meetsRequiredLevel(user.AUTHORIZATION_LEVEL.EMPLOYEE)) {
                    kadastraleSubject.warning = 'Om alle gegevens (ook natuurlijke personen) te kunnen vinden,' +
                    ' moet je als medewerker _speciale bevoegdheden_ hebben.'; // TODO: R: Links
                } else {
                    kadastraleSubject.warning = 'Om kadastraal subjecten te kunnen vinden,' +
                    ' moet je als medewerker/ketenpartner van Gemeente Amsterdam _inloggen_' +
                    ' en _speciale bevoegdheden_ hebben.'; // TODO: R: Links
                }
            }
        }

        /**
         * For both SEARCH BY QUERY (with and without category) and GEOSEARCH
         */
        function setSearchResults (searchResults) {
            const numberOfResults = searchResults.reduce(function (previous, current) {
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
