import angular from 'angular'

angular.module('dpShared').filter('coordinates', coordinatesFilter)

coordinatesFilter.$inject = ['crsConverter']

function coordinatesFilter(crsConverter) {
  /**
   * @param {Array} wgs84Location - An array with latitude and longitude, e.g. [52.123, 4.789]
   *
   * @returns {String} - A formatted string with RD and lat/lon coordinates "X, Y (lat, lon)"
   */
  return function (location, type) {
    let wgs84Location
    let rdLocation

    if (angular.isUndefined(location) || (angular.isArray(location) && location.length !== 2)) {
      return
    }

    if (type === 'RD') {
      rdLocation = location
      wgs84Location = crsConverter.rdToWgs84(rdLocation)
    } else if (type === 'WGS84') {
      wgs84Location = location
      rdLocation = crsConverter.wgs84ToRd(wgs84Location)
    } else {
      return
    }

    const formattedWgs84Location = wgs84Location
      .map(function (coordinate) {
        return coordinate.toFixed(7)
      })
      .join(', ')

    const formattedRdLocation = rdLocation
      .map(function (coordinate) {
        return coordinate.toFixed(2)
      })
      .join(', ')

    return `${formattedRdLocation} (${formattedWgs84Location})`
  }
}
