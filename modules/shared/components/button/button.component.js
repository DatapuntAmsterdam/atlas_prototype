import ACTIONS from '../../../../src/shared/actions';

(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpButton', {
            templateUrl: 'modules/shared/components/button/button.html',
            transclude: true,
            bindings: {
                className: '@',
                hoverText: '@',
                type: '@',
                payload: '<'
            },
            controller: DpButtonController,
            controllerAs: 'vm'
        });

    DpButtonController.$inject = ['$scope', 'store'];

    function DpButtonController ($scope, store) {
        const vm = this;

        vm.className = vm.className || 'o-btn o-btn--link';

        vm.dispatch = function () {
            store.dispatch(getAction(vm.type, vm.payload));
        };

        function getAction (type, payload) {
            const action = {
                type: ACTIONS[type] || type
            };
            if (angular.isDefined(payload)) {
                action.payload = payload;
            }
            return action;
        }
    }
})();
