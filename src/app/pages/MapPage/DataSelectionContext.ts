import { LatLng } from 'leaflet'
import { createContext } from 'react'
import { DataSelectionType } from './Components/config'
import { DataSelection, MapData, MapVisualization, PaginationParams } from './DataSelectionProvider'

type DataSelectionContextValues = {
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
  removeDataSelection: (idToRemove: string[]) => void
  mapVisualizations: MapVisualization[]
  dataSelection: DataSelection[]
  type: DataSelectionType
  setType: (type: DataSelectionType) => void
  loadingIds: string[]
  errorIds: string[]
  forbidden: boolean
}

export default createContext<DataSelectionContextValues>({
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
})
