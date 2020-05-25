import angular from 'angular'
import * as d3 from 'd3'

angular.module('dpDetail').config(configuration)

configuration.$inject = ['$provide']

function configuration($provide) {
  $provide.constant('d3', d3)
}
