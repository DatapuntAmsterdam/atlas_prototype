(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpLogoutButton', {
            templateUrl: 'modules/header/components/logout-button/logout-button.html',
            controller: DpLogoutButtonController,
            controllerAs: 'vm'
        });

    DpLogoutButtonController.$inject = ['$window'];

    function DpLogoutButtonController ($window) {
        var vm = this;

        vm.logout = $window.auth.logout;
    }
})();
