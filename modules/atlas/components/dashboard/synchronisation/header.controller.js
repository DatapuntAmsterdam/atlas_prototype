((() => {
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
            const state = store.getState(),
                isDataSelection = angular.isObject(state.dataSelection),
                isListView = isDataSelection && state.dataSelection.view === 'LIST',
                isCardsView = isDataSelection && state.dataSelection.view === 'CARDS',
                isHomepage = angular.isObject(state.page) && state.page.name === 'home' &&
                    !state.map.isFullscreen &&
                    !angular.isObject(state.straatbeeld);

            if ((isCardsView) ||
                (state.detail && state.detail.endpoint.includes('/catalogus/api/'))) {
                // Search in datasets
                vm.query = state.dataSelection && state.dataSelection.query;
                vm.searchAction = ACTIONS.FETCH_DATA_SELECTION;
            } else {
                // Default action is to search in data
                vm.query = state.search && state.search.query;
                vm.searchAction = ACTIONS.FETCH_SEARCH_RESULTS_BY_QUERY;
            }

            vm.hasPrintButton = (!isDataSelection || isListView) && !isHomepage;
            vm.hasEmbedButton = !angular.isObject(state.straatbeeld) &&
                angular.isObject(state.map) && state.map.isFullscreen;
        }
    }
}))();
