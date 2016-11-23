(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpToggleFullscreen', {
            bindings: {
                isFullscreen: '='
            },
            templateUrl: 'modules/map/components/toggle-fullscreen/toggle-fullscreen.html',
            controller: DpToggleFullscreenController,
            controllerAs: 'vm'
        });

    DpToggleFullscreenController.$inject = ['$scope'];

    function DpToggleFullscreenController ($scope) {
        var vm = this;

        $scope.$watch('vm.isFullscreen', function () {
            vm.buttonText = `Kaart ${vm.isFullscreen ? 'verkleinen' : 'vergroten'}`;
        });
    }
})();
