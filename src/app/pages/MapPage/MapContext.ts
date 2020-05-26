import { createContext } from 'react'
import { MapLayer as MapLayerProps } from '@datapunt/amsterdam-react-maps/lib/constants'

export type ActiveMapLayer = {
  id: string
  isVisible: boolean
}

export type MapLayer = {
  id: string
  external?: string
  url: string
  authScope?: string
  layers: Array<string>
} & MapLayerProps

export type Location = {
  lat: number
  lng: number
}

export type MapStateProps = {
  baseLayers: Array<Object> // Add auto typegeneration
  panelLayers: Array<Object> // Add auto typegeneration
  mapLayers: Array<MapLayer> // Add auto typegeneration
  activeBaseLayer: string
  activeMapLayers: Array<ActiveMapLayer>
  overlays: Array<Object> // Add auto typegeneration
  isMapPanelVisible: boolean
  zoomLevel: number
  viewCenter: Array<number>
  location?: Location
}

export type MapContextProps = {
  setActiveBaseLayer: Function
  setActiveMapLayers: Function
  setVisibleMapLayers: Function
  setLocation: Function
  toggleMapPanel: Function
  getBaseLayers: Function
  getPanelLayers: Function
  getMapLayers: Function
} & MapStateProps

const DEFAULT_LAT = 52.3731081
const DEFAULT_LNG = 4.8932945

export const initialState: MapContextProps = {
  activeBaseLayer: 'topografie',
  isMapPanelVisible: false,
  activeMapLayers: [],
  baseLayers: [],
  panelLayers: [],
  mapLayers: [],
  overlays: [],
  viewCenter: [DEFAULT_LAT, DEFAULT_LNG],
  zoomLevel: 11,
  setActiveBaseLayer: () => {},
  setActiveMapLayers: () => {},
  setVisibleMapLayers: () => {},
  setLocation: () => {},
  toggleMapPanel: () => {},
  getBaseLayers: () => {},
  getPanelLayers: () => {},
  getMapLayers: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
