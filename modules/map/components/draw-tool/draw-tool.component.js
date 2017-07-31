((() => {
    'use strict';

    angular
        .module('dpMap')
        .component('dpDrawTool', {
            bindings: {
                state: '=',
                polygon: '=',
                map: '='
            },
            templateUrl: 'modules/map/components/draw-tool/draw-tool.html',
            controller: DpDrawToolComponent,
            controllerAs: 'vm'
        });

    DpDrawToolComponent.$inject = ['$scope', 'store', 'ACTIONS', 'drawTool', 'DRAW_TOOL_CONFIG'];

    function DpDrawToolComponent ($scope, store, ACTIONS, drawTool, DRAW_TOOL_CONFIG) {
        var vm = this;

        let previousMarkers;

        drawTool.initialize(vm.map, onFinishShape, onDrawingMode);

        $scope.$watch('vm.state.drawingMode', drawingMode => {
            // enable is handled by the polygon markers watch method
            if (drawingMode === DRAW_TOOL_CONFIG.DRAWING_MODE.NONE) {
                // The drawing mode 'suddenly' appears to be `none` => cancel
                // drawing without saving anything drawn
                drawTool.cancel();
            }
        });

        $scope.$watch('vm.polygon.markers', (markers) => {
            // polygon markers are always set, even if empty
            setPolygon(markers);
        }, true);

        $scope.$watch('vm.state.geometry', (markers) => {
            // when map geometry is empty, set it to polygon
            const geometry = markers || vm.polygon.markers;
            setPolygon(geometry);
        }, true);

        /**
         * Pepares the draw tool service to show a polygon. Only in case the
         * draw tool is disabled. Will also enable the draw tool according to
         * the DRAWING_MODE in the state.
         *
         * @param {Array<[number, number]>} polygon The polygon to set.
         */
        function setPolygon (polygon) {
            if (!drawTool.isEnabled()) {
                drawTool.setPolygon(polygon);
                if (vm.state.drawingMode !== DRAW_TOOL_CONFIG.DRAWING_MODE.NONE) {
                    drawTool.enable();
                }
            }
        }

        /**
         * Updates the state when a polygon has been finished.
         *
         * Triggered by the draw tool.
         *
         * @param {Array<[number, number]>} polygon The finished polygon.
         */
        function onFinishShape (polygon) {
            const action = {
                type: ACTIONS.MAP_END_DRAWING
            };
            if (!angular.equals(polygon.markers, previousMarkers)) {
                // polygon has changed => update geometry filter
                action.payload = {
                    markers: polygon.markers,
                    description: drawTool.shape.distanceTxt + ' en ' + drawTool.shape.areaTxt
                };
            }
            store.dispatch(action);
        }

        /**
         * Updates the state when the drawing mode has changed.
         *
         * Triggered by the draw tool.
         *
         * @param {string} drawingMode The new drawing mode.
         */
        function onDrawingMode (drawingMode) {
            if (drawingMode === DRAW_TOOL_CONFIG.DRAWING_MODE.NONE) {
                // Make sure the NONE state goes into the store
                // We do not supply a payload, we do not finish a shape here
                store.dispatch({
                    type: ACTIONS.MAP_END_DRAWING
                });
            } else {
                previousMarkers = angular.copy(drawTool.shape.markers);
                store.dispatch({
                    type: ACTIONS.MAP_START_DRAWING,
                    payload: drawingMode
                });
            }
        }
    }
}))();
