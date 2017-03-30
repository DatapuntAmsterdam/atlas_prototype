(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['store', 'ACTIONS'];

    function HeaderController (store, ACTIONS) {
        const vm = this;

        store.subscribe(update);
        update();

        function update () {
            const state = store.getState();

            const IS_DATA_SELECTION = angular.isObject(state.dataSelection);
            const IS_HOMEPAGE = angular.isObject(state.page) && state.page.name === 'home' &&
                !state.map.isFullscreen &&
                !angular.isObject(state.straatbeeld);

            if ((state.dataSelection && state.dataSelection.view === 'CARDS') ||
                (state.detail && state.detail.endpoint.includes('/catalogus/api/'))) {
                // Search in datasets
                vm.query = state.dataSelection && state.dataSelection.query;
                vm.searchAction = ACTIONS.FETCH_DATA_SELECTION;
            } else {
                // Default action is to search in data
                vm.query = state.search && state.search.query;
                vm.searchAction = ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY;
            }

            vm.hasPrintButton = !IS_DATA_SELECTION && !IS_HOMEPAGE;
        }
    }
})();
