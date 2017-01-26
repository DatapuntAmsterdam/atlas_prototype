(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionHeader', {
            bindings: {
                state: '<',
                availableFilters: '<',
                numberOfRecords: '<',
                isLoading: '<'
            },
            templateUrl: 'modules/data-selection/components/header/header.html',
            controllerAs: 'vm',
            controller: DpDataSelectionHeaderController
        });

    DpDataSelectionHeaderController.$inject = ['$scope', 'DATA_SELECTION_CONFIG'];

    function DpDataSelectionHeaderController ($scope, DATA_SELECTION_CONFIG) {
        let vm = this;

        $scope.$watchGroup([
            'vm.state.dataset',
            'vm.state.view',
            'vm.numberOfRecords',
            'vm.isLoading'
        ], setHeader);

        function setHeader () {
            let isListView = vm.state.view === 'LIST';

            vm.showHeader = isListView || !vm.isLoading;
            vm.showButtons = vm.state.dataset !== 'catalogus';
            vm.showTitle = isListView || (!vm.isLoading && vm.numberOfRecords);
            vm.showSearchQuery = angular.isString(vm.state.query);
            vm.showTabs = isListView;
            vm.showNoResultsFound = vm.numberOfRecords === 0 && !vm.isLoading;
            vm.showActiveFilters = !vm.isLoading && Object.keys(vm.state.filters).length;

            vm.maxAvailablePages = DATA_SELECTION_CONFIG.datasets[vm.state.dataset].MAX_AVAILABLE_PAGES;
            vm.showMessageMaxPages = vm.maxAvailablePages && vm.state.page > vm.maxAvailablePages;

            vm.maxNumberOfClusteredMarkers = DATA_SELECTION_CONFIG.options.MAX_NUMBER_OF_CLUSTERED_MARKERS;
            vm.showMessageClusteredMarkers = isListView &&
                !vm.isLoading &&
                vm.numberOfRecords > vm.maxNumberOfClusteredMarkers;

            vm.datasetTitle = DATA_SELECTION_CONFIG.datasets[vm.state.dataset].TITLE;

            vm.tabs = ['bag', 'hr'].map(dataset => {
                return {
                    dataset: dataset,
                    title: DATA_SELECTION_CONFIG.datasets[dataset].TITLE,
                    isActive: vm.state.dataset === dataset
                };
            });
        }
    }
})();
