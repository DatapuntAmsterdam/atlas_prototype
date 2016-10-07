(function () {
    'use strict';

    angular
        .module('dpDataSelection')
        .component('dpDataSelectionKaartweergaveButton', {
            bindings: {
            },
            templateUrl: 'modules/data-selection/components/kaartweergave-button/kaartweergave-button.html',
            controller: DpDataSelectionKaartweergaveButtonController,
            controllerAs: 'vm'
        });

    DpDataSelectionKaartweergaveButtonController.$inject = ['$scope', '$window', 'dataSelectionConfig'];

    function DpDataSelectionKaartweergaveButtonController () {
        var vm = this;

        vm.kaartweergaveUrl = 'fillInTheUrl...';
    }
})();
