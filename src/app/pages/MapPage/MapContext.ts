import { Geometry } from 'geojson'
import { TileLayerOptions, WMSOptions } from 'leaflet'
import { createContext } from 'react'
import { MapCollection, MapLayer } from '../../../map/services'

export type ActiveMapLayer = {
  id: string
  isVisible: boolean
}

export interface WmsOverlay {
  type: 'wms'
  id: string
  url: string
  options: WMSOptions
  layer: MapLayer
  params?: {
    [key: string]: string
  }
}

export interface TmsOverlay {
  type: 'tms'
  id: string
  url: string
  options: TileLayerOptions
  layer: MapLayer
  params?: {
    [key: string]: string
  }
}

export type Overlay = WmsOverlay | TmsOverlay

export type MapState = {
  panelLayers: MapCollection[]
  mapLayers: MapLayer[]
  legendLeafletLayers: Overlay[]
  geometry?: Geometry
  showDrawTool: boolean
  showDrawContent: boolean
}

export type MapContextProps = {
  setGeometry: (geometry: Geometry) => void
  setShowDrawTool: (showDrawing: boolean) => void
  getPanelLayers: () => void
  getMapLayers: () => void
} & MapState

export const initialState: MapContextProps = {
  panelLayers: [],
  mapLayers: [],
  legendLeafletLayers: [],
  showDrawTool: false,
  showDrawContent: false,
  setGeometry: () => {},
  setShowDrawTool: () => {},
  getPanelLayers: () => {},
  getMapLayers: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
