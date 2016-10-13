(function () {
    'use strict';

    angular
        .module('atlasHeader')
        .component('atlasHeader', {
            bindings: {
                query: '@',
                isPrintMode: '='
            },
            templateUrl: 'modules/header/components/header/header.html',
            controller: AtlasHeaderController,
            controllerAs: 'vm'
        });

    AtlasHeaderController.$inject = ['user'];

    function AtlasHeaderController(user) {
        var vm = this;

        vm.isLoggedIn = function () {
            return user.getStatus().isLoggedIn;
        };

        vm.logout = user.logout;
    }
})();