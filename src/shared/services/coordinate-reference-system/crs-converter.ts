import { LatLngLiteral } from 'leaflet'
import proj4 from 'proj4'
import { RD, WGS84 } from '../../../map/services/crs-config'

export interface Wsg84Coordinate {
  latitude: number
  longitude: number
}

export interface RdCoordinate {
  x: number
  y: number
}

/**
 * Converts the given WGS84 coordinates (lat, lon) to RD coordinates.
 *
 * Please mind: x is lon (4.xxx) and y is lat (52.xxx).
 *
 * @param coordinate The original WSG84 coordinate to convert to RD.
 */
// TODO: Get rid of multiple types for coordinate and use 'LatLngLiteral' only.
export function wgs84ToRd(coordinate: Wsg84Coordinate | LatLngLiteral): RdCoordinate {
  const lng = 'lng' in coordinate ? coordinate.lng : coordinate.longitude
  const lat = 'lat' in coordinate ? coordinate.lat : coordinate.latitude
  const [x, y] = proj4(RD.projection, [lng, lat])

  return { x, y }
}

/**
 * Converts the given RD coordinates to WGS84 coordinates (lat, lon).
 *
 * Please mind: x is lon (4.xxx) and y is lat (52.xxx).
 *
 * @param coordinate The original RD coordinate to convert to WSG84.
 */
// TODO: Return a 'LatLngLiteral' here instead.
export function rdToWgs84(coordinate: RdCoordinate): Wsg84Coordinate {
  const [longitude, latitude] = proj4(RD.projection, WGS84.projection, [coordinate.x, coordinate.y])

  return {
    latitude,
    longitude,
  }
}

export const parseLocationString = (location: string) => ({
  lat: parseFloat(location.split(',')[0]),
  lng: parseFloat(location.split(',')[1]),
})

export const normalizeCoordinate = (coordinate?: number, precision?: number) =>
  coordinate ? parseFloat(coordinate.toFixed(precision)) : 0

export const normalizeLocation = (location: Wsg84Coordinate | RdCoordinate, precision?: number) =>
  Object.keys(location).reduce((acc, key) => {
    acc[key] = normalizeCoordinate(location[key], precision)
    return acc
  }, {})
