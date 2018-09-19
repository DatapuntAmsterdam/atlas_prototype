import ACTIONS from '../../../../src/shared/actions';

(() => {
    'use strict';

    angular
        .module('dpSearchResults')
        .component('dpSearchResults', {
            bindings: {
                show: '=',
                isLoading: '=',
                query: '@',
                location: '=',
                category: '@',
                numberOfResults: '=',
                user: '<'
            },
            templateUrl: 'modules/search-results/components/search-results/search-results.html',
            controller: DpSearchResultsController,
            controllerAs: 'vm'
        });

    DpSearchResultsController.$inject = [
        '$rootScope', '$scope', 'search', 'geosearch', 'TabHeader', 'store', 'activeOverlays'
    ];

    function DpSearchResultsController ($rootScope, $scope, search, geosearch, TabHeader, store,
                                        activeOverlays) {
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
        $scope.$watch('vm.user.scopes', updateWarningMessage);

        vm.loadMore = function () {
            vm.isLoadMoreLoading = true;

            search.loadMore(vm.searchResults[0]).then(function (searchResults) {
                vm.searchResults[0] = searchResults;
            }).finally(() => {
                vm.isLoadMoreLoading = false;
            });
        };

        vm.showTabHeader = () => !angular.isArray(vm.location) && !vm.category;

        vm.layerWarning = '';

        vm.tabHeader = new TabHeader('data-datasets');
        vm.tabHeader.activeTab = vm.tabHeader.getTab('data');

        function updateTabHeader (query, count) {
            if (vm.showTabHeader()) {
                vm.tabHeader.userScopes = vm.user.scopes;
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
                if (!vm.user.scopes.includes('BRK/RSN')) {
                    kadastraleSubject.warning = 'Medewerkers met speciale bevoegdheden' +
                        ' kunnen alle gegevens vinden (ook natuurlijke personen).';
                } else {
                    delete kadastraleSubject.warning;
                }
            }

            vm.layerWarning = !vm.query ? activeOverlays.getOverlaysWarning() : '';
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

            vm.hasLoadMore = function () {
                return angular.isString(vm.category) &&
                    vm.searchResults[0].count > vm.searchResults[0].results.length &&
                    !vm.isLoadMoreLoading;
            };
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
})();
