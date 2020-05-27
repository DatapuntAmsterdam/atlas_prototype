/* globals BBGA */
import angular from 'angular'

angular.module('dpDetail').directive('dpBbgaGraphs', dpBbgaGraphsDirective)

dpBbgaGraphsDirective.$inject = ['bbgaDataService']

function bootstrapBBGA() {
  return import(/* webpackChunkName: "BBGA" */ 'imports-loader?d3!bbga_visualisatie_d3')
}

function dpBbgaGraphsDirective(bbgaDataService) {
  return {
    restrict: 'E',
    scope: {
      gebiedHeading: '@',
      gebiedCode: '@',
    },
    templateUrl: 'modules/detail/components/bbga-graphs/bbga-graphs.html',
    link: linkFunction,
  }

  async function linkFunction(scope, element) {
    await bootstrapBBGA()

    bbgaDataService
      .getGraphData('PERSONEN', scope.gebiedHeading, scope.gebiedCode)
      .then(function (data) {
        const personenGraph = new BBGA.Personen()

        personenGraph.create(element[0].querySelector('.js-personen-graph'), data)
      })

    bbgaDataService
      .getGraphData('HUIZEN', scope.gebiedHeading, scope.gebiedCode)
      .then(function (data) {
        const huizenGraph = new BBGA.Huizen()

        huizenGraph.create(element[0].querySelector('.js-huizen-graph'), data)
      })
  }
}
