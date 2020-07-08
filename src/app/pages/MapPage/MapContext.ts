import { MapLayer as MapLayerProps } from '@datapunt/arm-core/es/constants'
import { Geometry } from 'geojson'
import { LatLngLiteral } from 'leaflet'
import { createContext } from 'react'

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
  location: LatLngLiteral | null
  detailUrl: string | null
  geometry?: Geometry
  drawingGeometry?: LatLngLiteral[]
}

export type MapContextProps = {
  setActiveBaseLayer: (ActiveBaseLayer: string) => void
  setActiveMapLayers: (ActiveMapLayer: Array<ActiveMapLayer>) => void
  setVisibleMapLayer: (id: string, isVisible: boolean) => void
  setLocation: (location: LatLngLiteral) => void
  setGeometry: (geometry: Geometry) => void
  setDrawingGeometry: (drawingGeometery: LatLngLiteral[]) => void
  setDetailUrl: (detailUrl: string | null) => void
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
  location: null,
  detailUrl: null,
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
