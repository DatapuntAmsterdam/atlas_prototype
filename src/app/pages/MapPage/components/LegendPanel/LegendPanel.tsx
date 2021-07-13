import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import { themeSpacing } from '@amsterdam/asc-ui'
import useParam from '../../../../utils/useParam'
import { useMapContext } from '../../MapContext'
import { mapLayersParam } from '../../query-params'
import MapLegendPanel from '../MapLegendPanel/MapLegendPanel'

const MapPanelContent = styled.div`
  overflow: hidden; // This can be removed if the new design for the legend is added
  margin: ${themeSpacing(3)};

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
  const [activeLayers, setActiveMapLayers] = useParam(mapLayersParam)

  // TODO: Replace 'MapPanel' with something better.
  return (
    <MapPanelContent data-testid="legendPanel">
      <MapLegendPanel
        panelLayers={panelLayers}
        onAddLayers={(mapLayers: string[]) => {
          if (mapLayers) {
            setActiveMapLayers([...activeLayers, ...mapLayers])
          }
        }}
        onRemoveLayers={(mapLayers: string[]) => {
          setActiveMapLayers(activeLayers.filter((layer) => !mapLayers.includes(layer)))
        }}
      />
    </MapPanelContent>
  )
}

export default LegendPanel
