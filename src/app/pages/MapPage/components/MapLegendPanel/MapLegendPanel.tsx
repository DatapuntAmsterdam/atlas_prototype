import type { FunctionComponent } from 'react'
import type { MapCollection } from '../../../../../api/cms_search/graphql'
import type { ExtendedMapGroup } from '../../legacy/services'
import MapLegend from './MapLegend'

export interface MapPanelOverlay {
  id: string
  isVisible: boolean
}

export interface MapPanelProps {
  onAddLayers: (layers: string[]) => void
  onRemoveLayers: (layers: string[]) => void
  panelLayers: MapCollection[]
}

const MapLegendPanel: FunctionComponent<MapPanelProps> = ({
  onAddLayers,
  onRemoveLayers,
  panelLayers,
}) => {
  return (
    <div
      data-testid="mapPanel"
      aria-label="Kaartlagen legenda"
      className="map-panel map-panel--expanded"
    >
      <div className="scroll-wrapper">
        {panelLayers.map(({ id, mapLayers, title }) => (
          <MapLegend
            onAddLayers={onAddLayers}
            onRemoveLayers={onRemoveLayers}
            key={id}
            activeMapLayers={mapLayers as ExtendedMapGroup[]}
            title={title}
          />
        ))}
      </div>
    </div>
  )
}

export default MapLegendPanel
