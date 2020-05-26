import React from 'react'
import MapContext from './MapContext'

// This is the "old" MapPanel that will be replaced
import MapPanel from '../../../map/containers/panel/MapPanel'
import getState from '../../../shared/services/redux/get-state'

const MapPanelComponent = () => {
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
    setMapPanelVisible,
  } = React.useContext(MapContext)

  // Get the user from the Redux state for now
  const { user } = getState()

  function onLayerToggle(payload: {
    // Add auto type generation
    id: string
    legendItems: Array<{ id: string; notSelectable: boolean }>
  }) {
    if (setActiveMapLayers)
      setActiveMapLayers(
        payload.legendItems?.some(({ notSelectable }) => !notSelectable) &&
          payload.legendItems.length > 0
          ? payload.legendItems.map(({ id: legendItemId }) => ({
              id: legendItemId,
              isVisible: true,
            }))
          : [{ id: payload.id, isVisible: true }],
      )
  }

  return (
    <MapPanel
      mapBaseLayers={baseLayers}
      panelLayers={panelLayers}
      activeBaseLayer={activeBaseLayer}
      overlays={activeMapLayers}
      onBaseLayerToggle={setActiveBaseLayer}
      onLayerToggle={onLayerToggle}
      onLayerVisibilityToggle={setVisibleMapLayers}
      onMapPanelToggle={setMapPanelVisible}
      isMapPanelVisible={isMapPanelVisible}
      zoomLevel={zoomLevel}
      user={user}
    />
  )
}

export default MapPanelComponent
