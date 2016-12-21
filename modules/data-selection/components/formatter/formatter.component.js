(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionFormatter', {
            bindings: {
                variables: '<',
                formatter: '@',
                template: '@',
                useInline: '<'
            },
            templateUrl: 'modules/data-selection/components/formatter/formatter.html',
            controller: DpDataSelectionFormatterController,
            controllerAs: 'vm'
        });

    DpDataSelectionFormatterController.$inject = ['$filter'];

    function DpDataSelectionFormatterController ($filter) {
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

        if (vm.template) {
            vm.templatePath = `modules/data-selection/components/formatter/templates/${vm.template}.html`;
        }
    }
})();
