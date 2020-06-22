import { createContext } from 'react'
import { MapLayer as MapLayerProps } from '@datapunt/arm-core/es/constants'

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

export type Geometry = {
  type: string
  coordinates: Array<Array<string>>
}

export type SimpleGeometry = { lat: number; lng: number }

export type DrawingGeometry = Array<SimpleGeometry>

export type Overlay = {
  type: string
  url: string
  overlayOptions: Object
  id: string
}

export type MapState = {
  baseLayers: Array<Object> // TODO: Add auto typegeneration
  panelLayers: Array<Object> // TODO: Add auto typegeneration
  mapLayers: Array<MapLayer> // TODO: Add auto typegeneration
  activeBaseLayer: string
  activeMapLayers: Array<ActiveMapLayer>
  overlays: Array<Overlay> // TODO: Add auto typegeneration
  zoomLevel: number
  viewCenter: Array<number>
  location?: Location
  detailUrl?: string
  geometry?: Geometry
  drawingGeometry?: DrawingGeometry
}

export type MapContextProps = {
  setActiveBaseLayer: (ActiveBaseLayer: string) => void
  setActiveMapLayers: (ActiveMapLayer: Array<ActiveMapLayer>) => void
  setVisibleMapLayer: (id: string, isVisible: boolean) => void
  setLocation: (location: Location) => void
  setGeometry: (geometry: Geometry) => void
  setDrawingGeometry: (drawingGeometery: DrawingGeometry) => void
  setDetailUrl: (url: string) => void
  getBaseLayers: () => void
  getPanelLayers: () => void
  getMapLayers: () => void
  getOverlays: () => void
} & MapState

const DEFAULT_LAT = 52.3731081
const DEFAULT_LNG = 4.8932945

export const initialState: MapContextProps = {
  activeBaseLayer: 'topografie',
  activeMapLayers: [],
  baseLayers: [],
  panelLayers: [],
  mapLayers: [],
  overlays: [],
  viewCenter: [DEFAULT_LAT, DEFAULT_LNG],
  zoomLevel: 11,
  setActiveBaseLayer: () => {},
  setActiveMapLayers: () => {},
  setVisibleMapLayer: () => {},
  setGeometry: () => {},
  setDrawingGeometry: () => {},
  setLocation: () => {},
  setDetailUrl: () => {},
  getBaseLayers: () => {},
  getPanelLayers: () => {},
  getMapLayers: () => {},
  getOverlays: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
