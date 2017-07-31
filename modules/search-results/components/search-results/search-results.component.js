((() => {
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

    DpSearchResultsController.$inject = [
        '$rootScope', '$scope', 'search', 'geosearch', 'TabHeader', 'user', 'store', 'ACTIONS'
    ];

    function DpSearchResultsController ($rootScope, $scope, search, geosearch, TabHeader, user, store, ACTIONS) {
        const vm = this;

        /**
         * watch isLoading and the query and location parameters of the state
         * if isLoading becomes true then find out what has te be loaded and get it
         */
        $scope.$watch('vm.isLoading', () => {
            if (vm.isLoading) {
                // First try to search on location
                // Test on isArray(location) is more precise than isString(query) because null maps to empty string (@)
                if (!searchByLocation(vm.location)) {
                    searchByQuery(vm.query, vm.category);
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

        vm.loadMore = () => {
            vm.isLoadMoreLoading = true;

            search.loadMore(vm.searchResults[0]).then(searchResults => {
                vm.isLoadMoreLoading = false;

                vm.searchResults[0] = searchResults;
            });
        };

        vm.showTabHeader = () => !angular.isArray(vm.location) && !vm.category;

        vm.meetsRequiredLevel = user.meetsRequiredLevel;

        vm.tabHeader = new TabHeader('data-datasets');
        vm.tabHeader.activeTab = vm.tabHeader.getTab('data');

        function updateTabHeader (query, count) {
            if (vm.showTabHeader()) {
                vm.tabHeader.query = query;
                vm.tabHeader.getTab('data').count = count;
            }
        }

        function searchByQuery (query, category) {
            const isQuery = angular.isString(query);
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
                    kadastraleSubject.warning = 'Medewerkers met speciale bevoegdheden' +
                        ' kunnen alle gegevens vinden (ook natuurlijke personen).';
                } else {
                    kadastraleSubject.warning = 'Om kadastraal subjecten te kunnen vinden,' +
                        ' moet je als medewerker/ketenpartner van Gemeente Amsterdam inloggen.' +
                        ' Om ook natuurlijke personen te vinden, moet je als medewerker bovendien' +
                        ' speciale bevoegdheden hebben.';
                }
            }
        }

        /**
         * For both SEARCH BY QUERY (with and without category) and GEOSEARCH
         */
        function setSearchResults (searchResults) {
            const numberOfResults = searchResults.reduce((previous, current) => {
                return previous + current.count +
                    (current.subResults
                        ? current.subResults.reduce((subPrevious, subCurrent) => {
                            return subPrevious + subCurrent.count;
                        }, 0)
                        : 0);
            }, 0);

            updateTabHeader(vm.query, numberOfResults);

            store.dispatch({
                type: ACTIONS.SHOW_SEARCH_RESULTS,
                payload: numberOfResults
            });

            // @TODO remove the exception when backend uses correct sub type name tg-3551
            searchResults = replaceBuurtcombinatie(searchResults);

            vm.searchResults = searchResults;

            vm.hasLoadMore = () => angular.isString(vm.category) &&
                vm.searchResults[0].count > vm.searchResults[0].results.length &&
                !vm.isLoadMoreLoading;
        }

        // @TODO remove the exception when backend uses correct sub type name tg-3551
        function replaceBuurtcombinatie (searchResults) {
            const results = angular.copy(searchResults);

            results.forEach((result) => {
                result.results.forEach((item) => {
                    if (item.subtype === 'buurtcombinatie') {
                        item.subtypeLabel = 'wijk';
                    }
                });
            });

            return results;
        }
    }
}))();
