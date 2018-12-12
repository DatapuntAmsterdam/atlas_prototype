import PANORAMA_VIEW from '../../../../src/shared/ducks/panorama/panorama-view';
import { setView } from '../../../../src/shared/ducks/panorama/actions';

(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpToggleStraatbeeldFullscreen', {
            restrict: 'E',
            bindings: {
                isFullscreen: '<'
            },
            templateUrl:
                'modules/straatbeeld/components/toggle-straatbeeld-fullscreen/toggle-straatbeeld-fullscreen.html',
            controller: DpStraatbeeldFullscreenController,
            controllerAs: 'vm'
        });

    DpStraatbeeldFullscreenController.$inject = ['$scope', 'store'];

    function DpStraatbeeldFullscreenController ($scope, store) {
        const vm = this;

        const deregistrationFn = $scope.$watch('vm.isFullscreen', setButtonText);

        function setButtonText () {
            vm.buttonText = 'Panoramabeeld ' + (vm.isFullscreen ? 'verkleinen' : 'vergroten');
        }

        vm.toggleFullscreen = function () {
            if (vm.isFullscreen) {
                store.dispatch(setView(PANORAMA_VIEW.MAP_PANO));
            } else {
                store.dispatch(setView(PANORAMA_VIEW.PANO));
            }
        };

        $scope.$on('$destroy', deregistrationFn);
    }
})();
