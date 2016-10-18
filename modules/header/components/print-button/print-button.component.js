(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpPrintButton', {
            transclude: true,
            templateUrl: 'modules/header/components/print-button/print-button.html',
            controller: DpPrintButtonController,
            controllerAs: 'vm'
        });

    DpPrintButtonController.$inject = ['$window'];

    function DpPrintButtonController ($window) {
        var vm = this;

        vm.print = function () {
            $window.print();
        };
    }
})();
