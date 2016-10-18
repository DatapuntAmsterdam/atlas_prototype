(function () {
    'use strict';

    angular
        .module('dpDetail')
        .directive('dpBbgaGraphs', dpBbgaGraphsDirective);

    dpBbgaGraphsDirective.$inject = ['BBGA', 'bbgaDataService'];

    function dpBbgaGraphsDirective (BBGA, bbgaDataService) {
        return {
            restrict: 'E',
            scope: {
                gebiedHeading: '@',
                gebiedCode: '@'
            },
            templateUrl: 'modules/detail/components/bbga-graphs/bbga-graphs.html',
            link: linkFunction
        };

        function linkFunction (scope, element) {
            bbgaDataService.getGraphData('PERSONEN', scope.gebiedHeading, scope.gebiedCode).then(function (data) {
                var personenGraph = new BBGA.Personen();

                personenGraph.create(element[0].querySelector('.js-personen-graph'), data);
            });

            bbgaDataService.getGraphData('HUIZEN', scope.gebiedHeading, scope.gebiedCode).then(function (data) {
                var huizenGraph = new BBGA.Huizen();

                huizenGraph.create(element[0].querySelector('.js-huizen-graph'), data);
            });
        }
    }
})();
