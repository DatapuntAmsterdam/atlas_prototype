(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpDrawTool', {
            bindings: {
                state: '=',
                polygon: '=',
                map: '='
            },
            controller: DpDrawToolComponent,
            controllerAs: 'vm'
        });

    DpDrawToolComponent.$inject = ['$scope', 'store', 'ACTIONS', 'drawTool'];

    function DpDrawToolComponent ($scope, store, ACTIONS, drawTool) {
        var vm = this;

        drawTool.initialize(vm.map, onFinishShape, onDrawingMode);

        $scope.$watch('vm.state.drawingMode', function (drawingMode) {
            // enable is handled by the polygon markers watch method
            if (!drawingMode) {
                drawTool.disable();
            }
        });

        $scope.$watch('vm.polygon.markers', (markers) => {
            // polygon markers are always set, even if empty
            setPolygon(markers);
        }, true);

        $scope.$watch('vm.state.geometry', (markers) => {
            // when map geometry is empty, set it to polygon, else delete polygon
            let geometry = markers || vm.polygon.markers;
            setPolygon(geometry);
        }, true);

        function setPolygon (polygon) {
            if (!drawTool.isEnabled()) {
                drawTool.setPolygon(polygon);
                if (vm.state.drawingMode) {
                    drawTool.enable();
                }
            }
        }

        function onFinishShape (polygon) {
            store.dispatch({
                type: ACTIONS.MAP_END_DRAWING,
                payload: {
                    geometryFilter: polygon.markers.reverse(),
                    geometryFilterDescription: drawTool.shape.distanceTxt + ' en ' + drawTool.shape.areaTxt
                }
            });
        }

        function onDrawingMode (drawingMode) {
            if (drawingMode) {
                store.dispatch({
                    type: ACTIONS.MAP_START_DRAWING,
                    payload: {
                        drawingMode: drawingMode
                    }
                });
            }
        }
    }
})();
