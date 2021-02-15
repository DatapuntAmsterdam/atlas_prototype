import { Point } from 'geojson'
import isObject from '../is-object'
import BOUNDING_BOX from '../../../map/services/bounding-box.constant'
import * as crsConverter from '../coordinate-reference-system/crs-converter'

interface GeometryContainer {
  geometrie?: Point
}

interface Data {
  bezoekadres?: GeometryContainer
  monumentcoordinaten?: Point
}

export const isVestigingAmsterdam = (geometrie: Point) => {
  const southWestWgs84Coordinates = {
    latitude: BOUNDING_BOX.COORDINATES.southWest[0],
    longitude: BOUNDING_BOX.COORDINATES.southWest[1],
  }

  const northEastWgs84Coordinates = {
    latitude: BOUNDING_BOX.COORDINATES.northEast[0],
    longitude: BOUNDING_BOX.COORDINATES.northEast[1],
  }

  const southWest = crsConverter.wgs84ToRd(southWestWgs84Coordinates)
  const northEast = crsConverter.wgs84ToRd(northEastWgs84Coordinates)

  const { coordinates } = geometrie

  if (
    coordinates[0] > southWest.x &&
    coordinates[0] < northEast.x &&
    coordinates[1] > southWest.y &&
    coordinates[1] < northEast.y
  ) {
    return true
  }

  return false
}

const getGeometry = (data: Data & GeometryContainer) => {
  if (isObject(data.geometrie)) {
    return data.geometrie
  }

  const bezoekAdresGeometry = data?.bezoekadres?.geometrie

  if (bezoekAdresGeometry && isVestigingAmsterdam(bezoekAdresGeometry)) {
    return bezoekAdresGeometry
  }

  if (isObject(data.monumentcoordinaten)) {
    return data.monumentcoordinaten
  }

  return null
}

export default getGeometry
