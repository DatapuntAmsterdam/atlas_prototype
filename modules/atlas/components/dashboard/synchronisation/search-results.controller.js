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

            vm.query = state.search && state.search.query;
            vm.location = state.search && state.search.location;
            vm.category = state.search && state.search.category;
        }
    }
})();
