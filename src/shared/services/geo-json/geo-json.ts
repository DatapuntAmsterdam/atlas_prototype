import { LatLngBoundsLiteral } from 'leaflet'
import { GeoJSON, Position } from 'geojson'

function getCoordinates(
  coordinates: Position[] | Position[][] | Position[][][],
): LatLngBoundsLiteral {
  const isCoordinate =
    coordinates.length === 2 &&
    typeof coordinates[0] === 'number' &&
    typeof coordinates[1] === 'number'

  if (isCoordinate) {
    // @ts-ignore
    return [[coordinates[0]], [coordinates[1]]]
  }

  // We have to go deeper recursively; two levels for Polygons, three levels for MultiPolygons
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return coordinates.map(getCoordinates).reduce(
    (accumulator: [][], values: LatLngBoundsLiteral) => [
      [...accumulator[0], ...values[0]],
      [...accumulator[1], ...values[1]],
    ],
    [[], []],
  )
}

/* This thing has support for Point, Polygon en MultiPolygon. The thing is CRS agnostic.
 *
 * @param {Object} geoJson
 *
 * @returns {Object.<string, number>} A location in latitude and longitude
 */
export default function getCenter(geoJson: GeoJSON) {
  if (geoJson.type === 'Point') {
    return {
      x: geoJson.coordinates[0],
      y: geoJson.coordinates[1],
    }
  }

  if ('coordinates' in geoJson) {
    const [xValues, yValues] = getCoordinates(geoJson.coordinates)

    // Just using `Math.min`/`Math.max` as the reducer function does not seem to
    // be working; returns `NaN`.
    const minFn = (a: number, b: number) => Math.min(a, b)
    const maxFn = (a: number, b: number) => Math.max(a, b)

    const xMin = xValues.reduce(minFn)
    const yMin = yValues.reduce(minFn)

    const xMax = xValues.reduce(maxFn)
    const yMax = yValues.reduce(maxFn)

    return {
      x: xMin + (xMax - xMin) / 2,
      y: yMin + (yMax - yMin) / 2,
    }
  }
  return null
}
