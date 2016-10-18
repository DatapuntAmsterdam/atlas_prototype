(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpCurrentDate', dpCurrentDateDirective);

    function dpCurrentDateDirective () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'modules/detail/components/current-date/current-date.html',
            controller: DpCurrentDateController,
            controllerAs: 'vm'
        };
    }

    function DpCurrentDateController () {
        var vm = this;

        vm.currentDate = new Date();
    }
})();
