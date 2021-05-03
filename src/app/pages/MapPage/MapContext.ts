// eslint-disable-next-line import/no-extraneous-dependencies
import { Feature } from 'geojson'
import { TileLayerOptions, WMSOptions } from 'leaflet'
import { Dispatch, SetStateAction, useContext } from 'react'
import { MapCollection, MapLayer } from '../../../map/services'
import createNamedContext from '../../utils/createNamedContext'

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
  const context = useContext(MapContext)

  if (!context) {
    throw new Error(
      'No provider found for MapContext, make sure you include MapContainer in your component hierarchy.',
    )
  }

  return context
}

export default MapContext
