import React from 'react';
import PropTypes from 'prop-types';
import MapLayers from '../../components/layers/MapLayers';
import MapLegend from '../../components/legend/MapLegend';
import MapPanelHandle from '../../components/panel-handle/MapPanelHandle';
import MapType from '../../components/type/MapType';

class MapPanel extends React.Component {
  componentDidUpdate(prevProps) {
    const {
      isMapPanelVisible,
      overlays
    } = this.props;

    if (isMapPanelVisible && prevProps.overlays.length < overlays.length) {
      const scrollElement = document.querySelector('.map-panel .map-legend');
      scrollElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const {
      isMapPanelVisible, activeBaseLayer, mapBaseLayers, onBaseLayerToggle, mapLayers,
      onMapPanelHandleToggle, activeMapLayers, onMapPanelToggle, onLayerToggle,
      onLayerVisibilityToggle, overlays, user, isPrint, zoomLevel,
      isMapPanelHandleVisible: mapPanelHandleVisisble
    } = this.props;
    return (
      <section
        aria-label={isMapPanelVisible ? 'Kaartlagen legenda, Kaartlagen verbergen' :
          'Kaartlagen legenda, Kaartlagen tonen'}
        aria-expanded={isMapPanelVisible}
        className={`
          map-panel
          map-panel--${isMapPanelVisible ? 'expanded' : 'collapsed'}
          map-panel--has${activeMapLayers.length > 0 ? '' : '-no'}-active-layers
        `}
      >
        <div className="map-panel__heading">
          <button
            className="map-panel__toggle"
            onClick={onMapPanelToggle}
            title={isMapPanelVisible ? 'Kaartlagen verbergen' : 'Kaartlagen tonen'}
          >
            <span className="map-panel__heading-icon" />
            <h2 className="map-panel__heading-title" aria-hidden="true">Kaartlagen</h2>
            <span className={`
              map-panel__toggle--icon
              map-panel__toggle--icon-${this.props.isMapPanelVisible ? 'collapse' : 'expand'}
            `}
            />
          </button>
        </div>
        <div className="scroll-wrapper">
          {activeMapLayers.length > 0 && (
            <MapLegend
              activeMapLayers={activeMapLayers}
              onLayerToggle={onLayerToggle}
              onLayerVisibilityToggle={onLayerVisibilityToggle}
              overlays={overlays}
              user={user}
              zoomLevel={zoomLevel}
              isPrint={isPrint}
            />
          )}
          <MapPanelHandle
            isMapPanelHandleVisible={mapPanelHandleVisisble}
            onMapPanelHandleToggle={onMapPanelHandleToggle}
          >
            <MapType
              activeBaseLayer={activeBaseLayer}
              baseLayers={mapBaseLayers}
              onBaseLayerToggle={onBaseLayerToggle}
            />
            <MapLayers
              activeMapLayers={activeMapLayers}
              layers={mapLayers}
              onLayerToggle={onLayerToggle}
            />
          </MapPanelHandle>
        </div>
      </section>
    );
  }
}

MapPanel.defaultProps = {
  activeMapLayers: [],
  isMapPanelVisible: true,
  map: {},
  mapBaseLayers: {},
  mapLayers: [],
  user: {},
  zoomLevel: 0
};

MapPanel.propTypes = {
  activeBaseLayer: PropTypes.string.isRequired,
  activeMapLayers: PropTypes.array, // eslint-disable-line
  isMapPanelHandleVisible: PropTypes.bool.isRequired,
  isMapPanelVisible: PropTypes.bool,
  isPrint: PropTypes.bool.isRequired,
  map: PropTypes.object, // eslint-disable-line
  mapBaseLayers: PropTypes.object, // eslint-disable-line
  mapLayers: PropTypes.arrayOf(PropTypes.object),
  onBaseLayerToggle: PropTypes.func.isRequired,
  onLayerToggle: PropTypes.func.isRequired,
  onLayerVisibilityToggle: PropTypes.func.isRequired,
  onMapPanelHandleToggle: PropTypes.func.isRequired,
  onMapPanelToggle: PropTypes.func.isRequired,
  overlays: PropTypes.arrayOf(PropTypes.object).isRequired,
  user: PropTypes.shape({}),
  zoomLevel: PropTypes.number
};

export default MapPanel;
