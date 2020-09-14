import { Feature } from 'geojson'
import { TileLayerOptions, WMSOptions } from 'leaflet'
import { createContext } from 'react'
import { MapCollection, MapLayer } from '../../../map/services'

export interface ActiveMapLayer {
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

export interface MapState {
  panelLayers: MapCollection[]
  mapLayers: MapLayer[]
  legendLeafletLayers: Overlay[]
  detailFeature: Feature | null
  showDrawTool: boolean
  showDrawContent: boolean
  panoFullScreen: boolean
}

export interface MapContextProps extends MapState {
  setDetailFeature: (feature: Feature) => void
  setShowDrawTool: (showDrawing: boolean) => void
  getPanelLayers: () => void
  getMapLayers: () => void
  setPanoFullScreen: (panoFullScreen: boolean) => void
}

export const initialState: MapContextProps = {
  panelLayers: [],
  mapLayers: [],
  legendLeafletLayers: [],
  showDrawTool: false,
  showDrawContent: false,
  detailFeature: null,
  setDetailFeature: () => {},
  setShowDrawTool: () => {},
  getPanelLayers: () => {},
  getMapLayers: () => {},
  panoFullScreen: false,
  setPanoFullScreen: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
