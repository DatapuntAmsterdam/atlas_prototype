import angular from 'angular'

angular.module('dpShared').factory('crsConverter', crsConverterFactory)

crsConverterFactory.$inject = ['CRS_CONFIG', 'proj4']

function crsConverterFactory(CRS_CONFIG, proj4) {
  return {
    wgs84ToRd,
    rdToWgs84,
  }

  /*
   * @params {Array} wgs84 - An array with this structure: [lat, lon]
   * let op x is lon (4.xxx) en y is lat (52.xxx)
   *
   * @returns {Array} - RD - An array with this structure: [x, y]
   */
  function wgs84ToRd(wgs84Coordinates) {
    return proj4(CRS_CONFIG.RD.projection, angular.copy(wgs84Coordinates).reverse())

    // return [Math.round(rd[0]), Math.round(rd[1])];
  }

  /*
   * @params {Array} RD - An array with this structure: [x, y]
   *
   * @returns {Array} wgs84 - An An array with this structure: [lat, lon]
   */
  function rdToWgs84(rdCoordinates) {
    return proj4(CRS_CONFIG.RD.projection, CRS_CONFIG.WGS84.projection, rdCoordinates).reverse()
  }
}
