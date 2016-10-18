/**
 * @ngdoc controller
 * @name atlas.controller:SearchResultsController
 * @description
 * Controller definition
*/
(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('SearchResultsController', SearchResultsController);

    SearchResultsController.$inject = ['$rootScope', 'store'];

    function SearchResultsController ($rootScope, store) {
        var vm = this;

        store.subscribe(update);
        update();

        function update () {
            var state = store.getState();

            if (state.search) {
                vm.isLoading = state.search.isLoading;
                vm.query = state.search.query;
                vm.location = state.search.location;
                vm.category = state.search.category;
                vm.numberOfResults = state.search.numberOfResults;
            }
        }
    }
})();
