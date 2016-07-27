(function () {
    'use strict';

    angular
        .module('atlasPage')
        .component('atlasLoginForm', {
            templateUrl: 'modules/page/components/login-form/login-form.html',
            controller: AtlasLoginFormController,
            controllerAs: 'vm'
        });

    AtlasLoginFormController.$inject = ['user'];

    function AtlasLoginFormController (user) {
        var vm = this;

        vm.errorMessage = null;

        vm.login = function () {
            vm.errorMessage = null;

            user
                .login(vm.username, vm.password)
                .then(function () {
                    console.log('ik ben lekker ingelogd');
                })
                .catch(function (errorMessage) {
                    vm.errorMessage = errorMessage;
                });
        };
    }
})();
