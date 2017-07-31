((() => {
    'use strict';

    angular
        .module('dpMap')
        .component('dpShapeSummary', {
            templateUrl: 'modules/map/components/draw-tool/shape-summary/shape-summary.html',
            controller: DpShapeSummaryController,
            controllerAs: 'vm'
        });

    DpShapeSummaryController.$inject = ['$scope', '$sce', 'store', 'ACTIONS', 'drawTool'];

    function DpShapeSummaryController ($scope, $sce, store, ACTIONS, drawTool) {
        const vm = this;

        $scope.$watch(() => drawTool.shape.markers, setSummary, true);
        $scope.$watch(drawTool.isEnabled, setSummary);

        function setSummary () {
            vm.showSummary = !drawTool.isEnabled() && drawTool.shape.markers.length === 2;
            vm.summary = $sce.trustAsHtml(drawTool.shape.distanceTxt);
        }

        vm.deleteGeometry = () => {
            store.dispatch({
                type: ACTIONS.MAP_CLEAR_DRAWING
            });
        };
    }
}))();
