import React from 'react'
import PropTypes from 'prop-types'
import { ChevronUp } from '@datapunt/asc-assets'
import MapLegend from '../../components/legend/MapLegend'
import MapPanelHandle from '../../components/panel-handle/MapPanelHandle'
import MapType from '../../components/type/MapType'

const MapPanel = ({
  isMapPanelVisible,
  activeBaseLayer,
  mapBaseLayers,
  onBaseLayerToggle,
  panelLayers,
  onMapPanelHandleToggle,
  activeMapLayers,
  onMapPanelToggle,
  onLayerToggle,
  onLayerVisibilityToggle,
  overlays,
  user,
  printMode,
  zoomLevel,
}) => (
  <section
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
        {mapBaseLayers && (
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
  </section>
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

MapPanel.propTypes = {
  activeBaseLayer: PropTypes.string.isRequired,
  activeMapLayers: PropTypes.array, // eslint-disable-line
  isMapPanelHandleVisible: PropTypes.bool.isRequired,
  isMapPanelVisible: PropTypes.bool,
  printMode: PropTypes.bool.isRequired,
  map: PropTypes.object, // eslint-disable-line
  mapBaseLayers: PropTypes.object, // eslint-disable-line
  panelLayers: PropTypes.arrayOf(PropTypes.object),
  onBaseLayerToggle: PropTypes.func.isRequired,
  onLayerToggle: PropTypes.func.isRequired,
  onLayerVisibilityToggle: PropTypes.func.isRequired,
  onMapPanelHandleToggle: PropTypes.func.isRequired,
  onMapPanelToggle: PropTypes.func.isRequired,
  overlays: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({}),
  zoomLevel: PropTypes.number,
}

export default MapPanel
