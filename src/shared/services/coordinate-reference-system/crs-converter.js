import proj4 from 'proj4'
import { RD, WGS84 } from '../../../map/services/crs-config'

/**
 * Converts the given WGS84 coordinates (lat, lon) to RD coordinates.
 *
 * Please mind: x is lon (4.xxx) and y is lat (52.xxx).
 *
 * @params {Object.<string, number>} wgs84Coordinates with keys `latitude` and
 * `longitude`.
 *
 * @returns {Object.<string, number>} RD coordinates with keys `x` and `y`.
 */
export function wgs84ToRd(wgs84Coordinates) {
  const rdCoordinates = proj4(RD.projection, [
    wgs84Coordinates.longitude || wgs84Coordinates.lng,
    wgs84Coordinates.latitude || wgs84Coordinates.lat,
  ])
  return {
    x: rdCoordinates[0],
    y: rdCoordinates[1],
  }
}

/**
 * Converts the given RD coordinates to WGS84 coordinates (lat, lon).
 *
 * Please mind: x is lon (4.xxx) and y is lat (52.xxx).
 *
 * @params {Object.<string, number>} rdCoordinates with keys `x` and `y`.
 *
 * @returns {Object.<string, number>} WGS84 coordinates with keys `latitude`
 * and `longitude`.
 */
export function rdToWgs84(rdCoordinates) {
  const wgs84Coordinates = proj4(RD.projection, WGS84.projection, [
    rdCoordinates.x,
    rdCoordinates.y,
  ])
  return {
    latitude: wgs84Coordinates[1],
    longitude: wgs84Coordinates[0],
  }
}

export const parseLocationString = (location) => ({
  lat: parseFloat(location.split(',')[0]),
  lng: parseFloat(location.split(',')[1]),
})

export const normalizeCoordinate = (coordinate, precision) =>
  coordinate ? parseFloat(coordinate.toFixed(precision)) : 0

export const normalizeLocation = (location, precision) =>
  Object.keys(location).reduce((acc, key) => {
    acc[key] = normalizeCoordinate(location[key], precision)
    return acc
  }, {})
