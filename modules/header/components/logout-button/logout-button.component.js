(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpLogoutButton', {
            templateUrl: 'modules/header/components/logout-button/logout-button.html',
            controller: DpLogoutButtonController,
            controllerAs: 'vm'
        });

    DpLogoutButtonController.$inject = ['authenticator'];

    function DpLogoutButtonController (authenticator) {
        var vm = this;

        vm.logout = authenticator.logout;
    }
})();
