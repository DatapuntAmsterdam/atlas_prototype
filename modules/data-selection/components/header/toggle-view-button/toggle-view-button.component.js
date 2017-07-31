((() => {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionToggleViewButton', {
            bindings: {
                view: '<'
            },
            templateUrl: 'modules/data-selection/components/header/toggle-view-button/toggle-view-button.html',
            controller: DpToggleViewButtonController,
            controllerAs: 'vm'
        });

    DpToggleViewButtonController.$inject = ['$scope'];

    function DpToggleViewButtonController ($scope) {
        const vm = this;

        $scope.$watch('vm.view', () => {
            if (vm.view === 'TABLE') {
                vm.targetView = 'LIST';
                vm.targetLabel = 'Kaart weergeven';
            } else {
                vm.targetView = 'TABLE';
                vm.targetLabel = 'Tabel weergeven';
            }
        });
    }
}))();
