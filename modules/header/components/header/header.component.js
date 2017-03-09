(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpHeader', {
            bindings: {
                query: '@',
                hasPrintButton: '<',
                isPrintMode: '='
            },
            templateUrl: 'modules/header/components/header/header.html',
            controller: DpHeaderController,
            controllerAs: 'vm'
        });

    DpHeaderController.$inject = ['authenticator', 'user'];

    function DpHeaderController (authenticator, user) {
        var vm = this;

        vm.login = authenticator.login;

        vm.isAuthenticated = () => user.getUserType() === user.USER_TYPE.AUTHENTICATED;

        vm.userName = () => user.getName().replace(/@.*$/, '');

        vm.userIsBevoegd = () => user.getAuthorizationLevel() === user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS;
    }
})();
