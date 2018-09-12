import { switchPage } from '../../../../../src/shared/ducks/ui/ui';
import PAGES from '../../../../../src/pages';

(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionList', {
            bindings: {
                content: '<'
            },
            templateUrl: 'modules/data-selection/components/views/list/list.html',
            controller: DpDataSelectionListController,
            controllerAs: 'vm'
        });


    DpDataSelectionListController.$inject = ['store', 'ACTIONS'];

    function DpDataSelectionListController (store, ACTIONS) {
        const vm = this;

        vm.openDetail = function (endpoint) {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
            store.dispatch(switchPage(PAGES.KAART_DETAIL));
        };
    }
})();
