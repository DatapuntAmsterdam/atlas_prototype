import React from 'react'
import { ChevronUp } from '@datapunt/asc-assets'
import MapLegend from '../../components/legend/MapLegend'
import MapPanelHandle from '../../components/panel-handle/MapPanelHandle'
import MapType from '../../components/type/MapType'

const MapPanel = ({
  activeBaseLayer,
  onBaseLayerToggle,
  onMapPanelHandleToggle,
  onMapPanelToggle,
  onLayerToggle,
  onLayerVisibilityToggle,
  overlays,
  printMode,
  activeMapLayers = [],
  isMapPanelVisible = true,
  mapBaseLayers = {},
  panelLayers = [],
  user = {},
  zoomLevel = 0,
}) => (
  <div
    aria-label={
      isMapPanelVisible
        ? 'Kaartlagen legenda, Kaartlagen verbergen'
        : 'Kaartlagen legenda, Kaartlagen tonen'
    }
    aria-expanded={isMapPanelVisible}
    className={`
          map-panel
          map-panel--${isMapPanelVisible ? 'expanded' : 'collapsed'}
          map-panel--has${activeMapLayers.length > 0 ? '' : '-no'}-active-layers
        `}
  >
    <div className="map-panel__heading">
      <button
        type="button"
        className="map-panel__toggle"
        onClick={onMapPanelToggle}
        title={isMapPanelVisible ? 'Kaartlagen verbergen' : 'Kaartlagen tonen'}
      >
        <span className="map-panel__heading-icon" />
        <h2 className="map-panel__heading-title" aria-hidden="true">
          Kaartlagen
        </h2>
        <span
          className={`
              map-panel__toggle--icon
              map-panel__toggle--icon-${isMapPanelVisible ? 'collapse' : 'expand'}
            `}
        >
          <ChevronUp />
        </span>
      </button>
    </div>
    <div className="scroll-wrapper">
      <MapPanelHandle
        {...{
          isMapPanelHandleVisible: true, // TODO: find out if we actually need these (and from where its used)
          onMapPanelHandleToggle,
        }}
      >
        {mapBaseLayers?.aerial?.length && mapBaseLayers?.topography?.length && (
          <MapType
            activeBaseLayer={activeBaseLayer}
            baseLayers={mapBaseLayers}
            onBaseLayerToggle={onBaseLayerToggle}
          />
        )}
        {panelLayers.map(({ id, mapLayers, title }) => (
          <MapLegend
            key={id}
            activeMapLayers={mapLayers}
            onLayerToggle={onLayerToggle}
            onLayerVisibilityToggle={onLayerVisibilityToggle}
            overlays={overlays}
            user={user}
            title={title}
            zoomLevel={zoomLevel}
            printMode={printMode}
          />
        ))}
      </MapPanelHandle>
    </div>
  </div>
)

MapPanel.defaultProps = {
  activeMapLayers: [],
  isMapPanelVisible: true,
  map: {},
  mapBaseLayers: {},
  panelLayers: [],
  user: {},
  zoomLevel: 0,
}

export default MapPanel
