import type { FunctionComponent } from 'react'
import type { MapCollection } from '../services'
import MapLegend from './MapLegend'

export interface MapPanelOverlay {
  id: string
  isVisible: boolean
}

export interface MapPanelProps {
  overlays: MapPanelOverlay[]
  onAddLayers: (layers: string[]) => void
  onRemoveLayers: (layers: string[]) => void
  panelLayers: MapCollection[]
  zoomLevel: number
}

const MapPanel: FunctionComponent<MapPanelProps> = ({
  overlays,
  onAddLayers,
  onRemoveLayers,
  panelLayers,
  zoomLevel,
}) => {
  return (
    <div
      data-testid="mapPanel"
      aria-label="Kaartlagen legenda"
      className="map-panel map-panel--expanded"
    >
      <div className="scroll-wrapper">
        {panelLayers.map(({ id, mapLayers, title }) => (
          // @ts-ignore
          <MapLegend
            onAddLayers={onAddLayers}
            onRemoveLayers={onRemoveLayers}
            key={id}
            activeMapLayers={mapLayers}
            overlays={overlays}
            title={title}
            zoomLevel={zoomLevel}
          />
        ))}
      </div>
    </div>
  )
}

export default MapPanel
