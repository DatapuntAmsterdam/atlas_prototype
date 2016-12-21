(function () {
    'use strict';

    angular
        .module('dpStraatbeeld')
        .component('dpStraatbeeldFullscreen', {
            restrict: 'E',
            bindings: {
                state: '<'
            },
            templateUrl:
            'modules/straatbeeld/components/toggle-straatbeeld-fullscreen/toggle-straatbeeld-fullscreen.html',
            controller: DpStraatbeeldFullscreenController,
            controllerAs: 'vm'
        });

    DpStraatbeeldFullscreenController.$inject = ['$rootScope', 'store', 'ACTIONS', 'userSettings'];

    function DpStraatbeeldFullscreenController ($rootScope, store, ACTIONS, userSettings) {
        var vm = this;

        vm.toggleFullscreen = function () {
            // Dispatch an action to change the pano
            let isFullscreen = !vm.state.isFullscreen;

            // Save the new state of the straatbeeld as a user setting
            userSettings.fullscreenStraatbeeld.value = isFullscreen.toString();

            store.dispatch({
                type: ACTIONS.STRAATBEELD_FULLSCREEN,
                payload: isFullscreen
            });
        };
    }
})();

