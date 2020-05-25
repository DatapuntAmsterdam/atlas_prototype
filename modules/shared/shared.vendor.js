import angular from 'angular'
import proj4 from 'proj4'
import * as Redux from 'redux'

angular.module('dpShared').config(configuration)

configuration.$inject = ['$provide', '$qProvider']

function configuration($provide, $qProvider) {
  $qProvider.errorOnUnhandledRejections(false)
  $provide.constant('proj4', proj4)
  $provide.constant('Redux', Redux)
}
