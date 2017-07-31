((() => {
    'use strict';

    angular
        .module('dpMap')
        .component('dpToggleDrawingTool', {
            templateUrl: 'modules/map/components/draw-tool/toggle-drawing-tool/toggle-drawing-tool.html',
            controller: DpToggleDrawingToolController,
            controllerAs: 'vm'
        });

    DpToggleDrawingToolController.$inject = ['$scope', 'drawTool', 'store', 'ACTIONS'];

    function DpToggleDrawingToolController ($scope, drawTool, store, ACTIONS) {
        const vm = this;

        // Follow enable/disable status of the drawing tool
        vm.isEnabled = drawTool.isEnabled;

        vm.shape = drawTool.shape;

        $scope.$watch(() => drawTool.shape.markers.length, setHasDrawnPolygon);

        vm.toggle = () => {
            if (drawTool.isEnabled()) {
                drawTool.disable();
            } else {
                if (drawTool.shape.markers.length > 0) {
                    drawTool.setPolygon([]);
                }
                drawTool.enable();
            }
        };

        function setHasDrawnPolygon (count) {
            vm.hasDrawnPolygon = count > 0;
        }
    }
}))();
