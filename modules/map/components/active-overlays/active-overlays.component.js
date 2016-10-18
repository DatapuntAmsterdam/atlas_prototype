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

    DpActiveOverlaysController.$inject = ['$scope', 'store', 'ACTIONS'];

    function DpActiveOverlaysController ($scope, store, ACTIONS) {
        var vm = this;

        vm.toggle = function () {
            store.dispatch({
                type: ACTIONS[!vm.showActiveOverlays ? 'SHOW_MAP_ACTIVE_OVERLAYS' : 'HIDE_MAP_ACTIVE_OVERLAYS']
            });
        };

        $scope.$watchCollection('vm.overlays', function () {
            vm.hideEverything = vm.overlays.length === 0;
        });

        $scope.$watch('vm.showActiveOverlays', function () {
            vm.buttonTitle = vm.showActiveOverlays ? 'Sluit' : 'Toon';

            vm.buttonTitle += ' legenda van geselecteerde kaartlagen';
        });
    }
})();
