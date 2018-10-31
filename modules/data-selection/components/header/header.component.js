import { features } from '../../../../src/shared/environment';
import DATA_SELECTION_CONFIG
    from '../../../../src/shared/services/data-selection/data-selection-config';
import {
    DATASETS,
    setDataset,
    VIEWS
} from '../../../../src/shared/ducks/data-selection/data-selection';

(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionHeader', {
            bindings: {
                geometryFilter: '<',
                dataset: '<',
                availableFilters: '<',
                filters: '<',
                numberOfRecords: '<',
                showHeader: '<',
                user: '<',
                view: '<'
            },
            templateUrl: 'modules/data-selection/components/header/header.html',
            controllerAs: 'vm',
            controller: DpDataSelectionHeaderController
        });

    DpDataSelectionHeaderController.$inject = ['$scope'];

    function DpDataSelectionHeaderController ($scope) {
        const vm = this;

        $scope.$watchGroup([
            'vm.dataset',
            'vm.geometryFilter',
            'vm.view',
            'vm.numberOfRecords'
        ], setHeader);

        function setHeader () {
            const isListView = vm.view === VIEWS.LIST;
            const config = DATA_SELECTION_CONFIG.datasets[vm.dataset];
            const exportAuthScope = config.AUTH_SCOPE;
            vm.showButtons = vm.dataset !== 'dcatd';
            vm.showDownloadButton = vm.view !== VIEWS.LIST &&
                vm.numberOfRecords > 0 &&
                (!exportAuthScope || vm.user.scopes.includes(exportAuthScope));
            vm.showTabs = isListView;
            vm.showNoResultsFound = vm.numberOfRecords === 0;
            vm.showActiveFilters = !!(
                Object.keys(vm.filters).length ||
                (vm.geometryFilter && vm.geometryFilter.markers && vm.geometryFilter.markers.length)
            );

            vm.canEditDataset = vm.user.scopes.includes('CAT/W');
            vm.showNumberOfRecords = vm.numberOfRecords > 0 &&
                DATA_SELECTION_CONFIG.datasets[vm.dataset].SHOW_NUMBER_OF_RECORDS;
            vm.datasetTitle = DATA_SELECTION_CONFIG.datasets[vm.dataset].TITLE;

            const tabs = [DATASETS.BAG, DATASETS.HR];

            /* istanbul ignore next */
            if (features.eigendommen) {
                tabs.push(DATASETS.BRK);
            }

            vm.tabs = tabs.map((dataset) => ({
                dataset,
                title: DATA_SELECTION_CONFIG.datasets[dataset].TITLE_TAB,
                tabAction: setDataset(dataset),
                isActive: vm.dataset === dataset
            }));
        }
    }
})();
