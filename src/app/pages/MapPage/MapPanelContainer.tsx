import React from 'react'
import MapContext from './MapContext'

// This is the "old" MapPanel that will be replaced
import MapPanel from '../../../map/containers/panel/MapPanel'
import getState from '../../../shared/services/redux/get-state'

const MapPanelComponent: React.FC = () => {
  const {
    baseLayers,
    panelLayers,
    activeBaseLayer,
    activeMapLayers,
    isMapPanelVisible,
    zoomLevel,
    setActiveBaseLayer,
    setActiveMapLayers,
    setVisibleMapLayers,
    toggleMapPanel,
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
    <MapPanel
      mapBaseLayers={baseLayers}
      panelLayers={panelLayers}
      activeBaseLayer={activeBaseLayer}
      overlays={activeMapLayers}
      onBaseLayerToggle={setActiveBaseLayer}
      onLayerToggle={onLayerToggle}
      onLayerVisibilityToggle={setVisibleMapLayers}
      onMapPanelToggle={toggleMapPanel}
      isMapPanelVisible={isMapPanelVisible}
      zoomLevel={zoomLevel}
      user={user}
    />
  )
}

export default MapPanelComponent
