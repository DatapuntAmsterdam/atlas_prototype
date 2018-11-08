import piwikTracker from '../../../../src/shared/services/piwik-tracker/piwik-tracker';

(function () {
    'use strict';

    angular
        .module('dpHeader')
        .component('dpLogo', {
            bindings: {
                size: '='
            },
            templateUrl: 'modules/header/components/logo/logo.html',
            controller: DpLogoController,
            controllerAs: 'vm'
        });

    DpLogoController.$inject = ['$scope', 'HEADER'];

    function DpLogoController ($scope, HEADER) {
        const vm = this;

        $scope.$watch('vm.size', updateSize);

        // TODO DP-6031: Create Redux Middelware, map Piwik events to ACTIONS
        vm.navigateHomeClick = () => sendPiwikEvent();

        function updateSize (size) {
            vm.isTall = vm.size === HEADER.SIZE.TALL;
            vm.isShort = vm.size === HEADER.SIZE.SHORT;
        }

        // TODO DP-6031: Create Redux Middelware, map Piwik events to ACTIONS
        function sendPiwikEvent () {
            const piwik = {
                TRACK_EVENT: 'trackEvent',
                NAVIGATE_HOME: 'home',
                NAVIGATION: 'navigation'
            };

            piwikTracker([piwik.TRACK_EVENT, piwik.NAVIGATION,
                piwik.NAVIGATE_HOME, window.document.title]);
        }
    }
})();
