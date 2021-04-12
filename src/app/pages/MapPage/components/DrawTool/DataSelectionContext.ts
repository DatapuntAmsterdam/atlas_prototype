import { LatLng } from 'leaflet'
import { createContext } from 'react'
import { DataSelectionType } from '../../config'
import { DataSelection, MapData, MapVisualization, PaginationParams } from './DataSelectionProvider'

interface DataSelectionContextValues {
  fetchData: (
    latLngs: LatLng[][],
    id: string,
    paginationParams: PaginationParams,
    mapData?: MapData,
    setState?: boolean,
  ) => Promise<DataSelection | null>
  fetchMapVisualization: (
    latLngs: LatLng[][],
    id: string,
    setState?: boolean,
  ) => Promise<MapVisualization | null>
  removeDataSelection: () => void
  mapVisualizations: MapVisualization[]
  dataSelection: DataSelection[]
  type: DataSelectionType
  setType: (type: DataSelectionType) => void
  loadingIds: string[]
  errorIds: string[]
  forbidden: boolean
}

export const dataSelectionInitialValue = {
  fetchData: () => {
    return {} as any
  },
  fetchMapVisualization: () => {
    return {} as any
  },
  removeDataSelection: () => {},
  mapVisualizations: [],
  dataSelection: [],
  forbidden: false,
  type: DataSelectionType.BAG,
  setType: () => {},
  loadingIds: [],
  errorIds: [],
}

const DataSelectionContext = createContext<DataSelectionContextValues>(dataSelectionInitialValue)

export default DataSelectionContext
