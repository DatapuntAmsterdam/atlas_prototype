((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionCards', {
            bindings: {
                content: '<'
            },
            controller: DpDataSelectionCardsController,
            templateUrl: 'modules/data-selection/components/views/cards/cards.html',
            controllerAs: 'vm'
        });

    DpDataSelectionCardsController.$inject = ['store', 'ACTIONS'];

    function DpDataSelectionCardsController (store, ACTIONS) {
        const vm = this;

        vm.fetch_detail = endpoint => {
            store.dispatch({
                type: ACTIONS.FETCH_DETAIL,
                payload: endpoint
            });
        };
    }
}))();
