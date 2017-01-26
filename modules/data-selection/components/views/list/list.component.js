(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionList', {
            bindings: {
                content: '<'
            },
            templateUrl: 'modules/data-selection/components/views/list/list.html',
            controllerAs: 'vm'
        });
})();
