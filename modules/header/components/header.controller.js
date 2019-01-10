import { isListView } from '../../../src/shared/ducks/data-selection/selectors';
import {
    isDataSelectionPage,
    isHomepage,
    isMapActive
} from '../../../src/store/redux-first-router/selectors';

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
            const state = store.getState();

            vm.hasPrintButton = (!isDataSelectionPage(state) || isListView(state)) && !isHomepage(state);
            vm.hasEmbedButton = isMapActive(state);
        }
    }
})();
