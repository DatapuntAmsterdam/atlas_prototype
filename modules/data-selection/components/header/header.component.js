(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionHeader', {
            bindings: {
                state: '=',
                numberOfRecords: '='
            },
            templateUrl: 'modules/data-selection/components/header/header.html',
            controllerAs: 'vm'
        });
})();
