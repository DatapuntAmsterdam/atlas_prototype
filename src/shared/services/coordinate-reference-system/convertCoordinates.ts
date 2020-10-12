import { rdToWgs84, wgs84ToRd } from './crs-converter'

type Coordinate = [number, number]

function convertCoordinates(location: Coordinate, type: 'RD' | 'WGS84') {
  let wgs84Location
  let rdLocation

  if (location.length !== 2) {
    return ''
  }

  if (type === 'RD') {
    rdLocation = location
    wgs84Location = rdToWgs84({
      x: rdLocation[0],
      y: rdLocation[1],
    })
  } else {
    wgs84Location = location
    rdLocation = wgs84ToRd({
      lat: wgs84Location[0],
      lng: wgs84Location[1],
    })
  }

  const formattedWgs84Location = Object.values(wgs84Location)
    .map((coordinate: number) => coordinate.toFixed(7))
    .join(', ')

  const formattedRdLocation = Object.values(rdLocation)
    .map((coordinate: number) => coordinate.toFixed(2))
    .join(', ')

  return `${formattedRdLocation} (${formattedWgs84Location})`
}

export default convertCoordinates
