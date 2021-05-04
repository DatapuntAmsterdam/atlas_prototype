import { v4 as uuidv4 } from 'uuid'
import { Feature } from 'geojson'
import { LatLngTuple } from 'leaflet'
import { DataSelectionMapVisualizationType, DataSelectionType } from '../../config'

interface NamedFeature extends Feature {
  name: string
}

interface MapVisualizationGeoJSON {
  id: string
  type: DataSelectionMapVisualizationType.GeoJSON
  data: NamedFeature[]
}

export interface Marker {
  id: string
  latLng: LatLngTuple
}

export interface MapVisualizationMarkers {
  id: string
  type: DataSelectionMapVisualizationType.Markers
  data: Marker[]
}

export type MapVisualization = MapVisualizationGeoJSON | MapVisualizationMarkers

type DataSelectionResult = Array<{
  id: string
  name: string
  marker?: Marker
}>

export interface DataSelectionResponse {
  totalCount: number
  results: DataSelectionResult
}

export const normalizeMapVisualization = (
  type: DataSelectionType,
  data: any,
  brkData: { eigenPercelen: any; nietEigenPercelen: any; extent: any },
): MapVisualization => {
  switch (type) {
    case DataSelectionType.BAG:
    case DataSelectionType.HR: {
      return {
        id: uuidv4(),
        type: DataSelectionMapVisualizationType.Markers,
        data: data.map(
          ({
            _source: { centroid },
            _id: id,
          }: {
            _source: { centroid: [number, number] }
            _id: string
          }) => ({
            id: type === DataSelectionType.HR ? id.split('ves').pop() : id,
            latLng: [centroid[1], centroid[0]],
          }),
        ),
      }
    }
    case DataSelectionType.BRK: {
      return {
        id: uuidv4(),
        type: DataSelectionMapVisualizationType.GeoJSON,
        data: [
          {
            type: 'Feature',
            name: 'dataSelection',
            geometry: brkData.eigenPercelen,
            properties: null,
          },
          {
            type: 'Feature',
            name: 'dataSelectionAlternate',
            geometry: brkData.nietEigenPercelen,
            properties: null,
          },
          {
            type: 'Feature',
            name: 'dataSelectionBounds',
            geometry: {
              coordinates: [
                [
                  [brkData.extent[0], brkData.extent[1]],
                  [brkData.extent[2], brkData.extent[3]],
                ],
              ],
              type: 'Polygon',
            },
            properties: null,
          },
        ],
      }
    }
    default:
      throw new Error(
        `Unable to get map visualization, encountered an unknown data selection type '${
          type as string
        }'.`,
      )
  }
}

export const normalizeData = (type: DataSelectionType, result: any): DataSelectionResponse => {
  switch (type) {
    case DataSelectionType.BAG:
      return {
        totalCount: result?.object_count,
        results: result?.object_list.map(
          ({
            landelijk_id,
            _openbare_ruimte_naam,
            huisnummer,
            huisnummer_toevoeging,
            huisletter,
          }: any) => ({
            id: landelijk_id || uuidv4(),
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            name: `${_openbare_ruimte_naam} ${huisnummer}${huisletter && ` ${huisletter}`}${
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              huisnummer_toevoeging && `-${huisnummer_toevoeging}`
            }`.trim(),
          }),
        ),
      }
    case DataSelectionType.HR:
      return {
        totalCount: result?.object_count,
        results: result?.object_list.map(({ handelsnaam, vestiging_id }: any) => ({
          id: vestiging_id || uuidv4(),
          name: handelsnaam,
        })),
      }
    case DataSelectionType.BRK:
      return {
        totalCount: result?.object_count,
        results: result?.object_list.map(({ aanduiding, kadastraal_object_id }: any) => ({
          id: kadastraal_object_id || uuidv4(),
          name: aanduiding,
        })),
      }
    default:
      throw new Error(
        `Unable to get data, encountered an unknown data selection type '${type as string}'.`,
      )
  }
}
