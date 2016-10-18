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
                hoverText: '@',
                type: '@',
                payload: '='
            }
        });

    DpLinkController.$inject = ['store', 'ACTIONS'];

    function DpLinkController (store, ACTIONS) {
        var vm = this;

        vm.className = vm.className || 'o-btn o-btn--link';

        vm.followLink = function () {
            var action = {
                type: ACTIONS[vm.type]
            };

            if (angular.isDefined(vm.payload)) {
                action.payload = vm.payload;
            }

            store.dispatch(action);
        };
    }
})();
