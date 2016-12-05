(function () {
    'use strict';

    angular
        .module('dpDataShared')
        .component('dpDataSharedFormatter', {
            bindings: {
                variables: '<',
                formatter: '@',
                useInline: '<'
            },
            templateUrl: 'modules/data-shared/components/formatter/formatter.html',
            controller: DpDataSharedFormatterController,
            controllerAs: 'vm'
        });

    DpDataSharedFormatterController.$inject = ['$filter'];

    function DpDataSharedFormatterController ($filter) {
        let vm = this,
            variablesObj = {};

        if (vm.formatter) {
            if (vm.variables.length === 1) {
                // Just pass the value (String) when there is only one variable
                vm.formattedValue = $filter(vm.formatter)(vm.variables[0].value);
            } else {
                // Pass all variables as an Object if there are more variables
                vm.variables.forEach(({key, value}) => variablesObj[key] = value);

                vm.formattedValue = $filter(vm.formatter)(variablesObj);
            }
        } else {
            // If there is no formatter; concatenate all values
            vm.formattedValue = vm.variables.map(variable => {
                return variable.value;
            }).join(' ');
        }
    }
})();
