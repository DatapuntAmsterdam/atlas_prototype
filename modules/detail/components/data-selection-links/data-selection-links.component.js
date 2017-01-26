(function () {
    'use strict';

    angular
        .module('dpDetail')
        .component('dpDataSelectionLinks', {
            bindings: {
                activeFilters: '='
            },
            templateUrl: 'modules/detail/components/data-selection-links/data-selection-links.html',
            controllerAs: 'vm'
        });
})();
