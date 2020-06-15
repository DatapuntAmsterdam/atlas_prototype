import identity from 'lodash.identity'
import { fetchWithToken } from '../api/api'
import generateId from '../state-token-generator/state-token-generator'
import { query as DSQuery } from './data-selection-api-data-selection'

export function query(config, view, activeFilters, page, search, geometryFilter) {
  return DSQuery(config, view, activeFilters, page, search, geometryFilter)
}

export function getMarkers(config, activeFilters, zoomLevel, boundingBox) {
  const params = {
    ...activeFilters,
    zoom: zoomLevel,
    bbox: JSON.stringify({
      _northEast: {
        lat: boundingBox.northEast[0],
        lng: boundingBox.northEast[1],
      },
      _southWest: {
        lat: boundingBox.southWest[0],
        lng: boundingBox.southWest[1],
      },
    }),
  }
  return boundingBox
    ? fetchWithToken(process.env.API_ROOT + config.ENDPOINT_MARKERS, params).then((data) => ({
        geoJsons: [
          data.eigenpercelen && {
            geoJson: data.eigenpercelen,
            id: generateId(),
            type: 'dataSelection',
          },
          data.niet_eigenpercelen && {
            geoJson: data.niet_eigenpercelen,
            id: generateId(),
            type: 'dataSelectionAlternate',
          },
          {
            geoJson: {
              coordinates: [
                [
                  [data.extent[0], data.extent[1]],
                  [data.extent[2], data.extent[3]],
                ],
              ],
              type: 'Polygon',
            },
            id: generateId(),
            type: 'dataSelectionBounds',
          },
        ].filter(identity),
        markers: data.appartementen.map((appartement) => ({
          iconData: {
            zoomLevel,
            count: appartement.aantal,
          },
          position: [appartement.geometrie.coordinates[1], appartement.geometrie.coordinates[0]],
          type: 'dataSelectionType',
        })),
      }))
    : Promise.resolve([])
}

export default {
  query,
  getMarkers,
}
