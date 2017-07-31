((() => {
    'use strict';

    angular
        .module('dpMap')
        .component('dpToggleActiveOverlays', {
            bindings: {
                overlays: '=',
                showActiveOverlays: '='
            },
            templateUrl: 'modules/map/components/toggle-active-overlays/toggle-active-overlays.html',
            controller: DpToggleActiveOverlaysController,
            controllerAs: 'vm'
        });

    DpToggleActiveOverlaysController.$inject = ['$scope', 'store', 'ACTIONS'];

    function DpToggleActiveOverlaysController ($scope, store, ACTIONS) {
        var vm = this;

        vm.toggle = () => {
            store.dispatch({
                type: ACTIONS[vm.showActiveOverlays ? 'HIDE_MAP_ACTIVE_OVERLAYS' : 'SHOW_MAP_ACTIVE_OVERLAYS']
            });
        };

        $scope.$watch('vm.overlays', () => {
            vm.visible = vm.overlays.length > 0;
        }, true);

        $scope.$watch('vm.showActiveOverlays', () => {
            vm.buttonTitle = vm.showActiveOverlays ? 'Sluit' : 'Toon';

            vm.buttonTitle += ' legenda van geselecteerde kaartlagen';
        });
    }
}))();
