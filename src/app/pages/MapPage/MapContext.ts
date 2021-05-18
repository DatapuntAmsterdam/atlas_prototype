// eslint-disable-next-line import/no-extraneous-dependencies
import type { Feature } from 'geojson'
import type { TileLayerOptions, WMSOptions } from 'leaflet'
import type { Dispatch, SetStateAction } from 'react'
import type { MapCollection, MapLayer } from '../../../map/services'
import createNamedContext from '../../utils/createNamedContext'
import useRequiredContext from '../../utils/useRequiredContext'

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
  showMapDrawVisualization: boolean
  panoFullScreen: boolean
  panoImageDate: string | null
  panelHeader: { type?: string | null; title?: string | null }
}

type Action<T extends keyof MapState> = Dispatch<SetStateAction<MapState[T]>>

export interface MapContextProps extends MapState {
  setDetailFeature: Action<'detailFeature'>
  setPanoFullScreen: Action<'panoFullScreen'>
  setPanoImageDate: Action<'panoImageDate'>
  setPanelHeader: Action<'panelHeader'>
  setShowMapDrawVisualization: Action<'showMapDrawVisualization'>
}

const MapContext = createNamedContext<MapContextProps | null>('Map', null)

export function useMapContext() {
  return useRequiredContext(MapContext)
}

export default MapContext
