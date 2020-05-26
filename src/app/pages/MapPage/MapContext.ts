import { createContext } from 'react'

export type MapStateProps = {
  baseLayers: Array<Object> // Add auto typegeneration
  panelLayers: Array<Object> // Add auto typegeneration
  activeBaseLayer: Object // Add auto typegeneration
  activeMapLayers: Array<Object> // Add auto typegeneration
  isMapPanelVisible: boolean
  zoomLevel: number
  viewCenter: Array<number>
}

export type MapContextProps = {
  setActiveBaseLayer: Function
  setActiveMapLayers: Function
  setVisibleMapLayers: Function
  setMapPanelVisible: Function
  getBaseLayers: Function
  getPanelLayers: Function
  getMapLayers: Function
} & MapStateProps

const DEFAULT_LAT = 52.3731081
const DEFAULT_LNG = 4.8932945

export const initialState: MapStateProps = {
  activeBaseLayer: 'topografie',
  isMapPanelVisible: false,
  activeMapLayers: [],
  baseLayers: [],
  panelLayers: [],
  viewCenter: [DEFAULT_LAT, DEFAULT_LNG],
  zoomLevel: 11,
}

const MapContext = createContext<Partial<MapContextProps>>(initialState)

export default MapContext
