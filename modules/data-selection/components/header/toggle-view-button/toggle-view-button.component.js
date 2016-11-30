(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionToggleViewButton', {
            bindings: {
                view: '@'
            },
            templateUrl: 'modules/data-selection/components/header/toggle-view-button/toggle-view-button.html',
            controller: DpToggleViewButtonController,
            controllerAs: 'vm'
        });

    function DpToggleViewButtonController () {
        let vm = this;

        if (vm.view === 'TABLE') {
            vm.targetView = 'LIST';
            vm.targetLabel = 'Lijstweergave';
        } else {
            vm.targetView = 'TABLE';
            vm.targetLabel = 'Tabelweergave';
        }
    }
})();
