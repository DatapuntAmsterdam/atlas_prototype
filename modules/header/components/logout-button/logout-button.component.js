import { authenticateRequest } from '../../../../src/shared/ducks/user/user';

(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpLogoutButton', {
            templateUrl: 'modules/header/components/logout-button/logout-button.html',
            controller: DpLogoutButtonController,
            controllerAs: 'vm'
        });

    DpLogoutButtonController.$inject = ['$window', 'store'];

    function DpLogoutButtonController ($window, store) {
        var vm = this;

        vm.logout = () => {
            store.dispatch(authenticateRequest('uitloggen'));
            $window.auth.logout();
        };
    }
})();
