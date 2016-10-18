(function () {
    'use strict';

    angular
        .module('dpPage')
        .component('dpLoginForm', {
            templateUrl: 'modules/page/components/login-form/login-form.html',
            controller: DpLoginFormController,
            controllerAs: 'vm'
        });

    DpLoginFormController.$inject = ['$window', 'user'];

    function DpLoginFormController ($window, user) {
        var vm = this;

        vm.errorMessage = null;

        vm.login = function (event) {
            event.preventDefault();

            vm.errorMessage = null;

            user
                .login(vm.username, vm.password)
                .then(function () {
                    $window.history.back();
                })
                .catch(function (errorMessage) {
                    vm.errorMessage = errorMessage;
                });
        };
    }
})();
