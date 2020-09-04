import { MapPanelContent, MapPanelContentProps } from '@datapunt/arm-core'
import React, { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import MapPanel from '../../../../map/containers/panel/MapPanel'
import MapContext from '../MapContext'
import useParam from '../../../utils/useParam'
import { mapLayersParam, zoomParam } from '../query-params'
import { getUser } from '../../../../shared/ducks/user/user'

const StyledMapPanelContent = styled(MapPanelContent)`
  overflow: hidden; // This can be removed if the new design for the legend is added

  .map-panel {
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

export interface LegendPanelProps extends Omit<MapPanelContentProps, 'title'> {}

const LegendPanel: React.FC<LegendPanelProps> = ({ ...otherProps }) => {
  const { panelLayers } = useContext(MapContext)
  const user = useSelector(getUser)
  const [zoomLevel] = useParam(zoomParam)
  const [activeLayers, setActiveMapLayers] = useParam(mapLayersParam)

  const overlays = useMemo(() => activeLayers.map((layer) => ({ id: layer, isVisible: true })), [
    activeLayers,
  ])

  // TODO: Replace 'MapPanel' with something better.
  return (
    <StyledMapPanelContent title="Legenda" {...otherProps}>
      {/* @ts-ignore */}
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
        isMapPanelVisible
        zoomLevel={zoomLevel}
        user={user}
      />
    </StyledMapPanelContent>
  )
}

export default LegendPanel
