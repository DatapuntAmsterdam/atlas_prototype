import environment from '../../../environment'
import { fetchWithToken } from '../api/api'
import generateId from '../state-token-generator/state-token-generator'
import { BoundingBox, FilterObject } from '../../../app/components/DataSelection/types'
import { LegacyDataSelectionConfigType } from './data-selection-config'

function getBrkMarkers(
  signal: AbortSignal,
  config: LegacyDataSelectionConfigType,
  activeFilters: FilterObject,
  zoomLevel: number,
  boundingBox: BoundingBox,
) {
  const params = {
    ...activeFilters,
    zoom: zoomLevel.toString(),
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
    ? fetchWithToken(
        `${environment.API_ROOT}${config.ENDPOINT_MARKERS ?? ''}`,
        params,
        signal,
      ).then((data) => ({
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
        ].filter((item) => item),
        markers: data.appartementen.map((appartement: any) => ({
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

export default getBrkMarkers
