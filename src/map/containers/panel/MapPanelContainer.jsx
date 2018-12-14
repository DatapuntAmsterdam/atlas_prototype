import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getMapPanelLayers,
  selectActivePanelLayers
} from '../../ducks/panel-layers/map-panel-layers';
import { getBaseLayers } from '../../ducks/base-layers/map-base-layers';
import {
  isPrintOrEmbedMode,
  isMapLayersVisible,
  isMapPanelHandleVisible,
  toggleMapPanelHandle
} from '../../../shared/ducks/ui/ui';
import MapLayers from '../../components/layers/MapLayers';
import MapLegend from '../../components/legend/MapLegend';
import MapPanelHandle from '../../components/panel-handle/MapPanelHandle';
import MapType from '../../components/type/MapType';
import {
  setMapBaseLayer,
  toggleMapOverlay,
  toggleMapOverlayVisibility,
  toggleMapPanel
} from '../../ducks/map/map';
import {
  getActiveBaseLayer,
  getMapOverlays,
  getMapZoom,
  isMapPanelActive
} from '../../ducks/map/map-selectors';
import { getUser } from '../../../shared/ducks/user/user';

const mapStateToProps = (state) => ({
  activeBaseLayer: getActiveBaseLayer(state),
  activeMapLayers: selectActivePanelLayers(state),
  isMapLayersVisible: isMapLayersVisible(state),
  isMapPanelHandleVisible: !state.map.overlays.length || isMapPanelHandleVisible(state),
  mapBaseLayers: getBaseLayers(state),
  mapLayers: getMapPanelLayers(state),
  overlays: getMapOverlays(state),
  zoomLevel: getMapZoom(state),
  user: getUser(state),
  isEmbedOrPrint: isPrintOrEmbedMode(state),
  isMapPanelVisible: isMapPanelActive(state)
});

// TODO: Add method that checks whether layer is active and toggles accordingly
const mapDispatchToProps = (dispatch) => bindActionCreators({
  onBaseLayerToggle: setMapBaseLayer,
  onLayerToggle: toggleMapOverlay,
  onLayerVisibilityToggle: toggleMapOverlayVisibility,
  onMapPanelHandleToggle: toggleMapPanelHandle,
  onMapPanelToggle: toggleMapPanel
}, dispatch);

class MapPanelContainer extends React.Component {
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
      onLayerVisibilityToggle, overlays, user, isEmbedOrPrint, zoomLevel,
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
              isEmbedOrPrint={isEmbedOrPrint}
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

MapPanelContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

MapPanelContainer.defaultProps = {
  activeMapLayers: [],
  isMapPanelVisible: true,
  map: {},
  mapBaseLayers: {},
  mapLayers: [],
  user: {},
  zoomLevel: 0
};

MapPanelContainer.propTypes = {
  activeBaseLayer: PropTypes.string.isRequired,
  activeMapLayers: PropTypes.array, // eslint-disable-line
  isMapPanelHandleVisible: PropTypes.bool.isRequired,
  isMapPanelVisible: PropTypes.bool,
  isEmbedOrPrint: PropTypes.bool.isRequired,
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

export default connect(mapStateToProps, mapDispatchToProps)(MapPanelContainer);
