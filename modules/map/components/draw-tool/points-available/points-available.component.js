((() => {
    'use strict';

    angular
        .module('dpMap')
        .component('dpPointsAvailable', {
            templateUrl: 'modules/map/components/draw-tool/points-available/points-available.html',
            controller: DpPointsAvailableController,
            controllerAs: 'vm'
        });

    DpPointsAvailableController.$inject = ['$scope', 'drawTool', 'DRAW_TOOL_CONFIG'];

    function DpPointsAvailableController ($scope, drawTool, DRAW_TOOL_CONFIG) {
        const vm = this;

        $scope.$watch(() => drawTool.shape.markers.length, setPoints);
        $scope.$watch(drawTool.isEnabled, setPoints);

        function setPoints () {
            vm.markersLeft = drawTool.shape.markersMaxCount - drawTool.shape.markers.length;
            vm.pointText = (vm.markersLeft === 1) ? 'punt' : 'punten';
            vm.showWarning = drawTool.isEnabled() && vm.markersLeft <= DRAW_TOOL_CONFIG.MARKERS_LEFT_WARNING;
        }
    }
}))();
