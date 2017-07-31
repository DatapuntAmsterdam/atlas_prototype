((() => {
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

    DpStraatbeeldFullscreenController.$inject = ['$rootScope', 'store', 'ACTIONS'];

    function DpStraatbeeldFullscreenController ($rootScope, store, ACTIONS) {
        const vm = this;

        const deregistrationFn = $rootScope.$watch('vm.isFullscreen', setScreenReaderText);

        function setScreenReaderText () {
            vm.screenReaderText = 'Kaart ' + (vm.isFullscreen ? 'verkleinen' : 'vergroten');
        }

        vm.toggleFullscreen = () => {
            store.dispatch({
                type: ACTIONS.STRAATBEELD_FULLSCREEN,
                payload: !vm.isFullscreen
            });
        };

        $rootScope.$on('$destroy', deregistrationFn);
    }
}))();

