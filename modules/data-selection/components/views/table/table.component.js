((() => {
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

        vm.followLink = endpoint => {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
        };
    }
}))();
