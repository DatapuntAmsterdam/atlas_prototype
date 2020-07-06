import { MapPanelContent } from '@datapunt/arm-core'
import React from 'react'

import styled from 'styled-components'
import MapPanel from '../../../../map/containers/panel/MapPanel'
import getState from '../../../../shared/services/redux/get-state'
import MapContext from '../MapContext'

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

const LegendPanel: React.FC = ({ ...otherProps }) => {
  const {
    panelLayers,
    activeMapLayers,
    zoomLevel,
    setActiveMapLayers,
    setVisibleMapLayer,
  } = React.useContext(MapContext)

  // Get the user from the Redux state for now
  const { user } = getState()

  const onLayerToggle = React.useCallback(
    ({
      id,
      legendItems,
    }: {
      // Add auto type generation
      id: string
      legendItems: Array<{ id: string; notSelectable: boolean }>
    }) => {
      if (setActiveMapLayers)
        setActiveMapLayers(
          legendItems?.some(({ notSelectable }) => !notSelectable) && legendItems.length > 0
            ? legendItems.map(({ id: legendItemId }) => ({
                id: legendItemId,
                isVisible: true,
              }))
            : [{ id, isVisible: true }],
        )
    },
    [setActiveMapLayers],
  )

  return (
    <StyledMapPanelContent title="Legenda" {...otherProps}>
      <MapPanel
        panelLayers={panelLayers}
        overlays={activeMapLayers}
        onLayerToggle={onLayerToggle}
        onLayerVisibilityToggle={setVisibleMapLayer}
        isMapPanelVisible
        zoomLevel={zoomLevel}
        user={user}
      />
    </StyledMapPanelContent>
  )
}

export default LegendPanel
