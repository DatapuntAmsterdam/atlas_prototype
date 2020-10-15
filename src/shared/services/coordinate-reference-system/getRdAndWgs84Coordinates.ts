import { Position } from 'geojson'
import { rdToWgs84, wgs84ToRd } from './crs-converter'

function getRdAndWgs84Coordinates(location: Position, type: 'RD' | 'WGS84') {
  if (location.length !== 2) {
    return ''
  }

  const wgs84Location =
    type === 'WGS84'
      ? location
      : rdToWgs84({
          x: location[0],
          y: location[1],
        })

  const rdLocation =
    type === 'RD'
      ? location
      : wgs84ToRd({
          lat: location[0],
          lng: location[1],
        })

  const formattedRdLocation = `${rdLocation[0].toFixed(2)}, ${rdLocation[1].toFixed(2)}`
  const formattedWgs84Location = `${wgs84Location[0].toFixed(7)}, ${wgs84Location[1].toFixed(7)}`

  return `${formattedRdLocation} (${formattedWgs84Location})`
}

export default getRdAndWgs84Coordinates
