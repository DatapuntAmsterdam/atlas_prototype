import { createContext } from 'react'
import { DataSelectionType } from './Components/config'
import { MapVisualization, DataSelection } from './DataSelectionProvider'

type DataSelectionContextValues = {
  fetchData: Function
  fetchMapVisualization: Function
  removeDataSelection: Function
  mapVisualization: MapVisualization[]
  dataSelection: DataSelection[]
  type: DataSelectionType
  setType: Function
  loadingIds: string[]
  errorIds: string[]
  forbidden: boolean
}

export default createContext<DataSelectionContextValues>({
  fetchData: () => {},
  fetchMapVisualization: () => {},
  removeDataSelection: () => {},
  mapVisualization: [],
  dataSelection: [],
  forbidden: false,
  type: DataSelectionType.BAG,
  setType: () => {},
  loadingIds: [],
  errorIds: [],
})
