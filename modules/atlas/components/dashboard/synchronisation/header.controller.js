import ACTIONS from '../../../../../src/shared/actions';

(function () {
    'use strict';

    angular
        .module('atlas')
        .controller('HeaderController', HeaderController);

    HeaderController.$inject = ['store'];

    function HeaderController (store) {
        const vm = this;

        store.subscribe(update);
        update();

        function update () {
            const state = store.getState(),
                isDataSelection = angular.isObject(state.dataSelection),
                isListView = isDataSelection && state.dataSelection.view === 'LIST',
                isCatalogView = isDataSelection && state.dataSelection.view === 'CATALOG',
                isHomepage = angular.isObject(state.page) && state.page.name === 'home' &&
                    !state.ui.isMapFullscreen &&
                    !angular.isObject(state.straatbeeld);

            if (isCatalogView) {
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
                angular.isObject(state.ui) && state.ui.isMapFullscreen;
        }
    }
})();
