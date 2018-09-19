import ACTIONS from '../../../../src/shared/actions';

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
                type: ACTIONS.STRAATBEELD_FULLSCREEN,
                payload: !vm.isFullscreen
            });
        };

        $scope.$on('$destroy', deregistrationFn);
    }
})();
