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

    DpHeaderController.$inject = ['user'];

    function DpHeaderController (user) {
        var vm = this;

        vm.isLoggedIn = function () {
            return user.getStatus().isLoggedIn;
        };

        vm.logout = user.logout;
    }
})();
