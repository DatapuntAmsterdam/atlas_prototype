import { features } from '../../../../src/shared/environment';
import { DATASET_ROUTE_MAPPER } from '../../../../src/shared/ducks/data-selection/constants';
import { toDatasetsTableWithFilter } from '../../../../src/store/redux-first-router';

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

        vm.getBAG = toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER.bag, vm.activeFilters);

        vm.getHR = toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER.hr, vm.activeFilters);

        vm.getBRK = toDatasetsTableWithFilter(DATASET_ROUTE_MAPPER.brk, vm.activeFilters);
    }
})();
