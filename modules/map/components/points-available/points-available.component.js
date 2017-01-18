(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpPointsAvailable', {
            bindings: {
                points: '='
            },
            templateUrl: 'modules/map/components/points-available/points-available.html',
            controller: DpPointsAvailableController,
            controllerAs: 'vm'
        });

    DpPointsAvailableController.$inject = ['store', 'ACTIONS', 'DRAW_TOOL_CONFIG'];

    function DpPointsAvailableController (store, ACTIONS, DRAW_TOOL_CONFIG) {
        let vm = this;
        vm.store = store;
        vm.pointsAvailable = 0;

        store.subscribe(setPoints);

        function setPoints () {
            const state = store.getState();

            let pointsOnMap = state.map.pointsDrawn;

            if (pointsOnMap > DRAW_TOOL_CONFIG.MAX_POINTS - DRAW_TOOL_CONFIG.POINT_WARNING_THRESHOLD) {
                vm.pointsAvailable = DRAW_TOOL_CONFIG.MAX_POINTS - pointsOnMap;
            }
        }

    }
})();
