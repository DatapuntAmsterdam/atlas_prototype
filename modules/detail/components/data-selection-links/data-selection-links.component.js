import { features } from '../../../../src/shared/environment';

(function () {
    'use strict';

    angular
        .module('dpDetail')
        .component('dpDataSelectionLinks', {
            bindings: {
                activeFilters: '='
            },
            templateUrl: 'modules/detail/components/data-selection-links/data-selection-links.html',
            controller: DpDataSelectionLinksController,
            controllerAs: 'vm'
        });

    function DpDataSelectionLinksController () {
        var vm = this;
        vm.eigendommen = features.eigendommen;
    }
})();
