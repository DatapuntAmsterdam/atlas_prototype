import angular from 'angular'
import { EARTH_RADIUS, RD, WGS84 } from '../../../../src/map/services/crs-config'

angular.module('dpShared').constant('CRS_CONFIG', {
  RD: RD,
  WGS84: WGS84,
  EARTH_RADIUS: EARTH_RADIUS, // The radius in meters
})
