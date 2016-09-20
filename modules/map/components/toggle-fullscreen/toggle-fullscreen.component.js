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

    DpToggleFullscreenController.$inject = ['$scope', 'store', 'ACTIONS'];

    function DpToggleFullscreenController ($scope, store, ACTIONS) {
        var vm = this;

        vm.toggle = function () {
            store.dispatch({
                type: !vm.isFullscreen ?
                    ACTIONS.STACKED_PANELS_SHOW_FULLSCREEN_MAP :
                    ACTIONS.STACKED_PANELS_HIDE_FULLSCREEN_MAP
            });
        };

        $scope.$watch('vm.isFullscreen', function () {
            if (vm.isFullscreen) {
                vm.buttonIcon = 'minimize';
                vm.buttonText = 'Kaart verkleinen';
            } else {
                vm.buttonIcon = 'fullscreen';
                vm.buttonText = 'Kaart vergroten';
            }
        });
    }
})();