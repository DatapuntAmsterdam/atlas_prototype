(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpError', {
            templateUrl: 'modules/shared/components/api-error/error.html',
            controller: DpErrorController,
            controllerAs: 'vm',
            bindings: {
                isHomePage: '@',
                hasMaxWidth: '@'
            }
        });

    function DpErrorController (store) {
        const vm = this;

        vm.store = store;

        function setLayout () { // eslint-disable-line complexity
            const state = store.getState();

            vm.user = state.user;
        }

        store.subscribe(setLayout);
        setLayout();
    }

    DpErrorController.$inject = ['store'];
})();
