(function () {
    'use strict';

    angular
        .module('dpShared')
        .component('dpPanel', {
            bindings: {
                isPanelVisible: '=',
                type: '@',
                canClose: '=',
                className: '@'
            },
            transclude: true,
            templateUrl: 'modules/shared/components/panel/panel.html',
            controller: DpPanelController,
            controllerAs: 'vm'
        });

    // type :
    // Danger (rode vormgeving)
    // Warning (blauwe vormgeving)
    // Default (grijze vormgeving) als niet wordt toegevoegd

    function DpPanelController () {
        var vm = this;

        vm.close = function () {
            vm.isPanelVisible = false;
        };
    }
})();
