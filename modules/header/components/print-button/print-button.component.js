(function () {
    'use strict';

    angular
        .module('atlasHeader')
        .component('atlasPrintButton', {
            transclude: true,
            templateUrl: 'modules/header/components/print-button/print-button.html',
            controller: AtlasPrintButtonController,
            controllerAs: 'vm'
        });

    AtlasPrintButtonController.$inject = ['$window'];

    function AtlasPrintButtonController ($window) {
        var vm = this;

        vm.print = function () {
            $window.print();
        };
    }
})();