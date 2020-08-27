import { Geometry } from 'geojson'
import { TileLayerOptions, WMSOptions } from 'leaflet'
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
  panelLayers: Array<Object> // TODO: Add auto typegeneration
  mapLayers: Array<MapLayer> // TODO: Add auto typegeneration
  legendLeafletLayers: Array<Overlay> // TODO: Add auto typegeneration
  detailUrl: string | null
  geometry?: Geometry
  showDrawTool: boolean
  showDrawContent: boolean
}

export type MapContextProps = {
  setGeometry: (geometry: Geometry) => void
  setDetailUrl: (url: string | null) => void
  setShowDrawTool: (showDrawing: boolean) => void
  getPanelLayers: () => void
  getMapLayers: () => void
} & MapState

export const initialState: MapContextProps = {
  panelLayers: [],
  mapLayers: [],
  legendLeafletLayers: [],
  detailUrl: null,
  showDrawTool: false,
  showDrawContent: false,
  setGeometry: () => {},
  setDetailUrl: () => {},
  setShowDrawTool: () => {},
  getPanelLayers: () => {},
  getMapLayers: () => {},
}

const MapContext = createContext<MapContextProps>(initialState)

export default MapContext
