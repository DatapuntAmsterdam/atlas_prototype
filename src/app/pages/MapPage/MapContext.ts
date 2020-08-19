import { Geometry } from 'geojson'
import { LatLngLiteral, TileLayerOptions, WMSOptions } from 'leaflet'
import { createContext } from 'react'

export type ActiveMapLayer = {
  id: string
  isVisible: boolean
}

// TODO: Generate these types from the GraphQL schema.
export interface MapLayer {
  __typename: 'MapLayer'
  id: string
  title: string
  type: MapLayerType
  noDetail: boolean
  minZoom: number
  maxZoom: number
  layers?: string[]
  url?: string
  params?: string
  detailUrl: string
  detailParams?: DetailParams
  detailIsShape?: boolean
  iconUrl?: string
  imageRule?: string
  notSelectable: boolean
  external?: boolean
  bounds: [number[]]
  authScope?: string
  category?: string
  legendItems?: MapLayerLegendItem[]
  meta: Meta
  href: string
}

type MapLayerLegendItem = MapLayer | LegendItem

interface Meta {
  description?: string
  themes: Theme[]
  datasetIds?: number[]
  thumbnail?: string
  date?: string
}

interface Theme {
  id: string
  title: string
}

interface LegendItem {
  __typename: 'LegendItem'
  title: string
  iconUrl?: string
  imageRule?: string
  notSelectable: boolean
}

export interface DetailParams {
  item: string
  datasets: string
}

export type MapLayerType = 'wms' | 'tms'

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
  drawingGeometries?: LatLngLiteral[][]
}

export type MapContextProps = {
  setActiveBaseLayer: (activeBaseLayer: string) => void
  setActiveMapLayers: (ActiveMapLayer: Array<ActiveMapLayer>) => void
  setVisibleMapLayer: (id: string, isVisible: boolean) => void
  setLocation: (location: LatLngLiteral | null) => void
  setGeometry: (geometry: Geometry) => void
  addDrawingGeometry: (drawingGeometry: LatLngLiteral[]) => void
  addDrawingGeometries: (drawingGeometries: LatLngLiteral[][]) => void
  deleteDrawingGeometry: (drawingGeometry: LatLngLiteral[]) => void
  resetDrawingGeometries: () => void
  setDetailUrl: (url: string | null) => void
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
  drawingGeometries: [],
  location: null,
  detailUrl: null,
  zoomLevel: 11,
  setActiveBaseLayer: () => {},
  setActiveMapLayers: () => {},
  setVisibleMapLayer: () => {},
  setGeometry: () => {},
  resetDrawingGeometries: () => {},
  addDrawingGeometry: () => {},
  addDrawingGeometries: () => {},
  deleteDrawingGeometry: () => {},
  setLocation: () => {},
  setDetailUrl: () => {},
  getBaseLayers: () => {},
  getPanelLayers: () => {},
  getMapLayers: () => {},
  getOverlays: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
