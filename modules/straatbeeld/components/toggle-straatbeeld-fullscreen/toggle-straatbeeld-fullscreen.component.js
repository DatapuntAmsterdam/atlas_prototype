import { routing } from '../../../../src/app/routes';
import { UPDATE_MAP } from '../../../../src/map/ducks/map/map';
import { getStraatbeeld } from '../../../../src/shared/ducks/straatbeeld/straatbeeld';

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
            store.dispatch({
                type: UPDATE_MAP,
                payload: {
                    noRedirect: true,
                    route: (store.getState().location.type === routing.panorama.type)
                        ? routing.mapPanorama.type
                        : routing.panorama.type,
                    query: {
                        panoId: getStraatbeeld(store.getState()).id,
                        panoHeading: getStraatbeeld(store.getState()).heading
                    }
                }
            });
        };

        $scope.$on('$destroy', deregistrationFn);
    }
})();
