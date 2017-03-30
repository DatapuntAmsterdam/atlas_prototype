(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpMenu', {
            bindings: {
                hasPrintButton: '<',
                size: '='
            },
            templateUrl: 'modules/header/components/menu/menu.html',
            controller: DpMenuController,
            controllerAs: 'vm'
        });

    DpMenuController.$inject = ['$scope', 'authenticator', 'user'];

    function DpMenuController ($scope, authenticator, user) {
        const vm = this;

        vm.login = authenticator.login;

        vm.isAuthenticated = () => user.getUserType() === user.USER_TYPE.AUTHENTICATED;

        $scope.$watchGroup([getUsername, getUserIsBevoegd], setUserMenuLabel);

        function getUsername () {
            return user.getName().replace(/@.*$/, '');
        }

        function getUserIsBevoegd () {
            return user.getAuthorizationLevel() === user.AUTHORIZATION_LEVEL.EMPLOYEE_PLUS;
        }

        function setUserMenuLabel ([username, isBevoegd]) {
            const maxLength = isBevoegd ? 4 : 9,
                name = username.length > maxLength + 1
                    ? username.substr(0, maxLength) : username,
                ellipsis = name !== username ? '...' : '',
                space = ellipsis ? '' : ' ',
                bevoegd = isBevoegd ? space + '(bevoegd)' : '';

            vm.userMenuLabel = name + ellipsis + bevoegd;
        }
    }
})();
