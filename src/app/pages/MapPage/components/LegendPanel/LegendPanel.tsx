import type { FunctionComponent } from 'react'
import { useMemo } from 'react'
import styled from 'styled-components'
import MapPanel, { MapPanelOverlay } from '../../legacy/panel/MapPanel'
import useParam from '../../../../utils/useParam'
import { useMapContext } from '../../MapContext'
import { mapLayersParam, zoomParam } from '../../query-params'

const MapPanelContent = styled.div`
  overflow: hidden; // This can be removed if the new design for the legend is added

  .map-panel {
    // The embed mode hides the legend panel, so we need to force it to show.
    // TODO: Once we introduce the new LegendPanel we should remove these styles.
    display: block !important;
    max-height: 100%;
    height: 100%;
    max-width: 100%;
    width: 100%;
    box-shadow: none;
    margin: 0;
    bottom: 0;
    left: 0;

    & > .scroll-wrapper {
      max-height: 100%;
      height: 100%;
    }

    & > .map-panel__heading {
      display: none;
    }
  }
`

const LegendPanel: FunctionComponent = () => {
  const { panelLayers } = useMapContext()
  const [zoomLevel] = useParam(zoomParam)
  const [activeLayers, setActiveMapLayers] = useParam(mapLayersParam)

  const overlays = useMemo<MapPanelOverlay[]>(
    () => activeLayers.map((layer) => ({ id: layer, isVisible: true })),
    [activeLayers],
  )

  // TODO: Replace 'MapPanel' with something better.
  return (
    <MapPanelContent data-testid="legendPanel">
      <MapPanel
        panelLayers={panelLayers}
        overlays={overlays}
        onAddLayers={(mapLayers: string[]) => {
          if (mapLayers) {
            setActiveMapLayers([...activeLayers, ...mapLayers])
          }
        }}
        onRemoveLayers={(mapLayers: string[]) => {
          setActiveMapLayers(activeLayers.filter((layer) => !mapLayers.includes(layer)))
        }}
        zoomLevel={zoomLevel}
      />
    </MapPanelContent>
  )
}

export default LegendPanel
