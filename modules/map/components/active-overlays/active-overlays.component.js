(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpActiveOverlays', {
            bindings: {
                overlays: '=',
                zoom: '=',
                showActiveOverlays: '='
            },
            templateUrl: 'modules/map/components/active-overlays/active-overlays.html',
            controller: DpActiveOverlaysController,
            controllerAs: 'vm'
        });

    DpActiveOverlaysController.$inject = ['$scope', 'overlays', 'user'];

    function DpActiveOverlaysController ($scope, overlays, user) {
        var vm = this;

        $scope.$watch(user.getAuthorizationLevel, setOverlays);

        $scope.$watchGroup(['vm.overlays', 'vm.showActiveOverlays'], setOverlays, true);

        function setOverlays () {
            vm.validOverlays = vm.overlays.filter(overlay => overlays.SOURCES[overlay.id]);
            vm.visible = vm.showActiveOverlays && vm.overlays.length > 0;
        }
    }
})();
