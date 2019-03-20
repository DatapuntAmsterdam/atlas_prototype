import { hasPrintMode, isMapActive } from '../../../src/shared/ducks/ui/ui';
import { isHomepage } from '../../../src/store/redux-first-router/selectors';

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

            vm.hasPrintButton = hasPrintMode(state);
            vm.isHomepage = isHomepage(state);
            vm.hasEmbedButton = isMapActive(state);
        }
    }
})();
