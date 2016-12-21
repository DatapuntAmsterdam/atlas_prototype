(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionCards', {
            bindings: {
                content: '<'
            },
            templateUrl: 'modules/data-selection/components/cards/cards.html',
            controllerAs: 'vm'
        });
})();
