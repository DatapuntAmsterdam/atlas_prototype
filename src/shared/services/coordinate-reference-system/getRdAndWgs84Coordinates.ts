import { Position } from 'geojson'
import { rdToWgs84, wgs84ToRd } from './crs-converter'

function getRdAndWgs84Coordinates(location: Position, type: 'RD' | 'WGS84') {
  if (location.length !== 2) {
    return ''
  }

  const wgs84Location =
    type === 'WGS84'
      ? {
          latitude: location[0],
          longitude: location[1],
        }
      : rdToWgs84({
          x: location[0],
          y: location[1],
        })

  const rdLocation =
    type === 'RD'
      ? {
          x: location[0],
          y: location[1],
        }
      : wgs84ToRd({
          lat: location[0],
          lng: location[1],
        })

  const formattedRdLocation = `${rdLocation.x.toFixed(2)}, ${rdLocation.y.toFixed(2)}`
  const formattedWgs84Location = `${wgs84Location.latitude.toFixed(
    7,
  )}, ${wgs84Location.longitude.toFixed(7)}`

  return `${formattedRdLocation} (${formattedWgs84Location})`
}

export default getRdAndWgs84Coordinates
