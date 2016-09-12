(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionDownloadButton', {
            bindings: {
                dataset: '@',
                activeFilters: '='
            },
            templateUrl: 'modules/data-selection/components/download-button/download-button.html',
            controller: DpDataSelectionDownloadButtonController,
            controllerAs: 'vm'
        });

    DpDataSelectionDownloadButtonController.$inject = ['$scope', '$window', 'dpDataSelectionConfig'];

    function DpDataSelectionDownloadButtonController ($scope, $window, dpDataSelectionConfig) {
        var vm = this,
            filterParams = [];

        vm.downloadUrl = dpDataSelectionConfig[vm.dataset].ENDPOINT_EXPORT;

        dpDataSelectionConfig[vm.dataset].FILTERS.forEach(function (filter) {
            if (angular.isString(vm.activeFilters[filter.slug])) {
                filterParams.push(filter.slug + '=' + $window.encodeURIComponent(vm.activeFilters[filter.slug]));
            }
        });

        if (filterParams.length) {
            vm.downloadUrl += '?' + filterParams.join('&');
        }
    }
})();
