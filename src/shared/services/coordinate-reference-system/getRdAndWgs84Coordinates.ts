import { Position } from 'geojson'
import { RdCoordinate, rdToWgs84, wgs84ToRd, Wsg84Coordinate } from './crs-converter'

function coordinateToTuple(coordinate: Wsg84Coordinate | RdCoordinate) {
  return [
    'latitude' in coordinate ? coordinate.latitude : coordinate.x,
    'longitude' in coordinate ? coordinate.longitude : coordinate.y,
  ]
}

export default function getRdAndWgs84Coordinates(location: Position, type: 'RD' | 'WGS84') {
  if (location.length !== 2) {
    return ''
  }

  const rdLocation =
    type === 'RD'
      ? location
      : coordinateToTuple(
          wgs84ToRd({
            lat: location[0],
            lng: location[1],
          }),
        )

  const wgs84Location =
    type === 'WGS84'
      ? location
      : coordinateToTuple(
          rdToWgs84({
            x: location[0],
            y: location[1],
          }),
        )

  const formattedRdLocation = rdLocation.map((x) => x.toFixed(2)).join(', ')
  const formattedWgs84Location = wgs84Location.map((x) => x.toFixed(7)).join(', ')

  return `${formattedRdLocation} (${formattedWgs84Location})`
}
