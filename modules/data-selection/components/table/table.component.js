(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionTable', {
            bindings: {
                content: '='
            },
            templateUrl: 'modules/data-selection/components/table/table.html',
            controller: DpDataSelectionTableController,
            controllerAs: 'vm'
        });

    DpDataSelectionTableController.$inject = ['store', 'ACTIONS'];
    function DpDataSelectionTableController(store, ACTIONS) {
        var vm = this;

        vm.dpGotoItem = function(link) {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: link
            });
        };
    }
})();
