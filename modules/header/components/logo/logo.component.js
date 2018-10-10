import { routing } from '../../../../src/app/routes';

(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpLogo', {
            bindings: {
                size: '='
            },
            templateUrl: 'modules/header/components/logo/logo.html',
            controller: DpLogoController,
            controllerAs: 'vm'
        });

    DpLogoController.$inject = ['$scope', 'HEADER'];

    function DpLogoController ($scope, HEADER) {
        const vm = this;

        vm.homeType = routing.home.type;

        $scope.$watch('vm.size', updateSize);

        function updateSize (size) {
            vm.isTall = vm.size === HEADER.SIZE.TALL;
            vm.isShort = vm.size === HEADER.SIZE.SHORT;
        }
    }
})();
