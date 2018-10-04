import { authenticateError } from '../../../../src/reducers/user';
import { routing } from '../../../../src/app/routes';

(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpMenu', {
            bindings: {
                hasPrintButton: '<',
                hasEmbedButton: '<',
                size: '=',
                user: '<'
            },
            templateUrl: 'modules/header/components/menu/menu.html',
            controller: DpMenuController,
            controllerAs: 'vm'
        });

    DpMenuController.$inject = ['$scope', '$window', 'store'];

    function DpMenuController ($scope, $window, store) {
        const vm = this;

        vm.helpType = routing.help.type;

        vm.login = () => {
            try {
                $window.auth.login();
            } catch (error) {
                store.dispatch(authenticateError());
            }
        };

        $scope.$watch('vm.user.name', setUserMenuLabel);

        function setUserMenuLabel (username) {
            const maxLength = 9;
            const name = username.replace(/@.*$/, '');
            const truncatedName = name.length > maxLength + 1
                ? name.substr(0, maxLength) : name;
            const ellipsis = truncatedName !== name ? '...' : '';

            vm.userMenuLabel = truncatedName + ellipsis;
        }
    }
})();
