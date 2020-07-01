import center from '@turf/center'
import { Geometry, Position } from 'geojson'
import { LatLngLiteral } from 'leaflet'
import { fetchWithToken } from '../../../shared/services/api/api'
import { DetailResult } from '../../types/details'
import { RD, WGS84 } from '../crs-config'
import { ServiceDefinition } from '../map-services.config'
import { getDetailUrl } from './getDetailUrl'

// TODO: Write some tests for this method.

export interface MapDetails {
  result: DetailResult
  geometry: Geometry
  location: LatLngLiteral
}

/**
 * Retrieves map details for a specific id from the service definition and applies any normalization if needed.
 *
 * @param serviceDefinition The service definition to retrieve the map detail with.
 * @param id The id of the map details item.
 */
export async function fetchDetails(
  serviceDefinition: ServiceDefinition,
  id: string,
): Promise<MapDetails> {
  const detailUrl = getDetailUrl(serviceDefinition, id)
  // TODO: Remove this when we no longer have v1 endpoints.
  const supportsCrs = serviceDefinition.endpoint?.startsWith('v1')
  // Add request headers to retrieve coordinates in WGS84.
  const headers = new Headers(supportsCrs ? { 'Accept-Crs': 'EPSG:4258' } : undefined)
  // TODO: Fetching logic should be added to the service definition in order to make this code type-safe.
  const responseData = await fetchWithToken(detailUrl, undefined, undefined, undefined, headers, '')
  const normalizedData = serviceDefinition.normalization?.(responseData) ?? responseData
  const result = serviceDefinition.mapDetail(normalizedData)

  // TODO: Once fetching logic becomes part of the service definition it should always return the 'geometry' uniformly.
  let geometry: Geometry =
    responseData.geometrie || responseData.geometry || normalizedData.geometry

  // TODO: This check can be removed once the API calls have been made type safe.
  if (!geometry) {
    throw new Error('Unable to fetch map details, the API did not return any geometry.')
  }

  // Convert RD geometry to standard WGS84.
  if (!supportsCrs) {
    geometry = await convertGeometry(geometry)
  }

  if (geometry.type === 'GeometryCollection') {
    throw new Error(
      `Unable to fetch map details, cannot parse geometry of type '${geometry.type}'.`,
    )
  }

  const centerCoordinates = center(geometry).geometry?.coordinates

  if (!centerCoordinates) {
    throw new Error('Unable to fetch map details, cannot parse center of geometry.')
  }

  const location: LatLngLiteral = {
    lng: centerCoordinates[0],
    lat: centerCoordinates[1],
  }

  return {
    result,
    geometry,
    location,
  }
}

/**
 * Converts geometry that is in the Rijksdriehoek format to standard WGS84.
 *
 * @param geometry The geometry to convert.
 */
async function convertGeometry(geometry: Geometry): Promise<Geometry> {
  if (geometry.type === 'GeometryCollection') {
    const geometries = await Promise.all(geometry.geometries.map(convertGeometry))

    return {
      ...geometry,
      geometries,
    }
  }

  return {
    ...geometry,
    coordinates: await convertPositions(geometry.coordinates),
  } as Geometry
}

type ValueOrArray<T> = T | Array<ValueOrArray<T>>

/**
 * Converts positions in the Rijksdriehoek format to WGS84.
 *
 * @param positions The positions to convert.
 */
async function convertPositions(
  positions: ValueOrArray<Position>,
): Promise<ValueOrArray<Position>> {
  if (isPosition(positions)) {
    const proj4 = await loadProj4()
    return proj4(RD.projection, WGS84.projection, positions)
  }

  return Promise.all(positions.map(convertPositions))
}

function isPosition(position: ValueOrArray<Position>): position is Position {
  return typeof position[0] === 'number'
}

// Load PROJ4 dynamically to reduce bundle size, since only a few API endpoint return RD coordinates this is not a problem.
async function loadProj4() {
  return (await import(/* webpackChunkName: "PROJ4" */ 'proj4')).default
}
