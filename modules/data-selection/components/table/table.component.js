(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionTable', {
            bindings: {
                content: '=',
                currentPage: '='
            },
            templateUrl: 'modules/data-selection/components/table/table.html',
            controllerAs: 'vm'
        });
})();