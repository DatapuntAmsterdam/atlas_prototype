import { switchPage } from '../../../../../src/shared/ducks/ui/ui';
import PAGES from '../../../../../src/pages';

(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionTable', {
            bindings: {
                content: '<',
                dataset: '<'
            },
            templateUrl: 'modules/data-selection/components/views/table/table.html',
            controller: DpDataSelectionTableController,
            controllerAs: 'vm'
        });

    DpDataSelectionTableController.$inject = ['store', 'ACTIONS'];

    function DpDataSelectionTableController (store, ACTIONS) {
        const vm = this;

        vm.followLink = function (endpoint) {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
            store.dispatch(switchPage(PAGES.KAART_DETAIL));
        };
    }
})();
