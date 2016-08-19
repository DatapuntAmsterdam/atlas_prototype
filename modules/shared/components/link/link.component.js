(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpLink', {
            templateUrl: 'modules/shared/components/link/link.html',
            transclude: true,
            controller: DpLinkController,
            controllerAs: 'vm',
            bindings: {
                className: '@',
                type: '@',
                payload: '='
            }
        });

    DpLinkController.$inject = ['store', 'ACTIONS'];

    function DpLinkController (store, ACTIONS) {
        var vm = this;

        vm.className = vm.className || 'o-btn o-btn--link';

        vm.followLink = function () {
            store.dispatch({
                type: ACTIONS[vm.type],
                payload: vm.payload
            });
        };
    }
})();