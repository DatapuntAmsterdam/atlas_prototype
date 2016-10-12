(function () {
    'use strict';

    angular
        .module('atlasDetail')
        .directive('atlasCurrentDate', atlasCurrentDateDirective);

    function atlasCurrentDateDirective () {
        return {
            restrict: 'E',
            scope: true,
            templateUrl: 'modules/detail/components/current-date/current-date.html',
            controller: AtlasCurrentDateController,
            controllerAs: 'vm'
        };
    }

    function AtlasCurrentDateController () {
        var vm = this;

        vm.currentDate = new Date();
    }
})();
