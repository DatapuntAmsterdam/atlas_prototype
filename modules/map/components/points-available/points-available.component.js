(function () {
    'use strict';

    angular
        .module('dpMap')
        .component('dpPointsAvailable', {
            templateUrl: 'modules/map/components/points-available/points-available.html',
            controller: DpPointsAvailableController,
            controllerAs: 'vm'
        });

    DpPointsAvailableController.$inject = ['$scope', 'drawTool'];

    function DpPointsAvailableController ($scope, drawTool) {
        let vm = this;

        const MARKERS_LEFT_WARNING = 5;

        setPoints();
        $scope.$watch(() => drawTool.shape.markers.length, setPoints);
        $scope.$watch(drawTool.isEnabled, setPoints);

        function setPoints () {
            vm.markersLeft = drawTool.shape.markersMaxCount - drawTool.shape.markers.length;
            vm.pointText = (vm.markersLeft === 1) ? 'punt' : 'punten';
            vm.showWarning = drawTool.isEnabled() && vm.markersLeft < MARKERS_LEFT_WARNING;
        }
    }
})();
