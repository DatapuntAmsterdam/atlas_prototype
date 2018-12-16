import { toPanorama } from '../../../../src/store/redux-first-router';
import {
    getPanoramaHeading,
    getPanoramaId
} from '../../../../src/panorama/ducks/panorama';
import PANORAMA_VIEW from '../../../../src/panorama/ducks/panorama';

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
            // TODO: refactor, make component unaware of store
            // (wrap in smart component like connect in React).
            const state = store.getState();
            const id = getPanoramaId(state);
            const heading = getPanoramaHeading(state);
            if (vm.isFullscreen) {
                store.dispatch(toPanorama(id, heading, PANORAMA_VIEW.MAP_PANO));
            } else {
                store.dispatch(toPanorama(id, heading, PANORAMA_VIEW.PANO));
            }
        };

        $scope.$on('$destroy', deregistrationFn);
    }
})();
