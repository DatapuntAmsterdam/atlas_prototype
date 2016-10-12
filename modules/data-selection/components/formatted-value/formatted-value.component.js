(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionFormattedValue', {
            bindings: {
                value: '<',
                format: '<'
            },
            templateUrl: 'modules/data-selection/components/formatted-value/formatted-value.html',
            controller: DpDataSelectionFormattedValueController,
            controllerAs: 'vm'
        });

    DpDataSelectionFormattedValueController.$inject = ['$filter'];

    function DpDataSelectionFormattedValueController ($filter) {
        var vm = this;

        vm.formattedValue = vm.value;
        angular.forEach(vm.format && vm.format.filters, function (filter) {
            vm.formattedValue = $filter(filter)(vm.formattedValue);
        });

        vm.class = '';
        switch (vm.format && vm.format.align) {
            case 'right':
                vm.class = 'u-align--right';
                break;
            default:
                break;
        }
    }
})();
