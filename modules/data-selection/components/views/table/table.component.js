import ACTIONS from '../../../../../src/shared/actions';

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

    DpDataSelectionTableController.$inject = ['store'];

    function DpDataSelectionTableController (store) {
        const vm = this;

        vm.followLink = function (endpoint) {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
        };
    }
})();
