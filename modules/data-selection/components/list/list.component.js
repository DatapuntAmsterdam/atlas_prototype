(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionList', {
            templateUrl: 'modules/data-selection/components/list/list.html',
            bindings: {
                data: '='
            },
            controllerAs: 'vm'
        });
})();
