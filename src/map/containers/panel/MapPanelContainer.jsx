import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectActivePanelLayers } from '../../ducks/panel-layers/map-panel-layers';
import { getBaseLayers } from '../../ducks/base-layers/map-base-layers';
import { toggleMapPanel, toggleMapPanelHandle } from '../../../shared/ducks/ui/ui';
import MapLayers from '../../components/layers/MapLayers';
import MapLegend from '../../components/legend/MapLegend';
import MapPanelHandle from '../../components/panel-handle/MapPanelHandle';
import MapType from '../../components/type/MapType';
import CollapseIcon from '../../../../public/images/icon-arrow-down.svg';
import ExpandIcon from '../../../../public/images/icon-arrow-up.svg';
import MapLayersIcon from '../../../../public/images/icon-map-layers.svg';
import { setMapBaseLayer, toggleMapOverlay, toggleMapOverlayVisibility } from '../../ducks/map/map';

const mapStateToProps = (state) => ({
  activeBaseLayer: state.map.baseLayer,
  activeMapLayers: selectActivePanelLayers(state),
  atlas: state.atlas,
  isMapPanelVisible: state.ui.isMapPanelVisible,
  isMapLayersVisible: state.ui.isMapLayersVisible,
  isEachOverlayInvisible: state.map.overlays.every((overlay) => overlay.isVisible),
  isMapPanelHandleVisible: !state.map.overlays.length || state.ui.isMapPanelHandleVisible,
  mapBaseLayers: getBaseLayers(state),
  mapLayers: state.mapLayers.panelLayers.items,
  overlays: state.map.overlays,
  zoomLevel: state.map.zoom,
  user: state.user
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
    if (this.props.isMapPanelVisible && prevProps.overlays.length < this.props.overlays.length) {
      const scrollEl = document.querySelector('.map-panel .map-legend');
      if (scrollEl) {
        scrollEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  render() {
    return (
      <section
        aria-label={this.props.isMapPanelVisible ? 'Kaartlagen legenda, Kaartlagen verbergen' :
          'Kaartlagen legenda, Kaartlagen tonen'}
        aria-expanded={this.props.isMapPanelVisible}
        className={`
          map-panel
          map-panel--${this.props.isMapPanelVisible ? 'expanded' : 'collapsed'}
          map-panel--has${this.props.activeMapLayers.length > 0 ? '' : '-no'}-active-layers
          map-panel--has${this.props.isEachOverlayInvisible ? '-not' : ''}-just-invisible-layers
        `}
      >
        <div className="map-panel__heading">
          <button
            className="map-panel__toggle"
            onClick={this.props.onMapPanelToggle}
            title={this.props.isMapPanelVisible ? 'Kaartlagen verbergen' : 'Kaartlagen tonen'}
          >
            <MapLayersIcon className="map-panel__heading-icon" />
            <h2 className="map-panel__heading-title" aria-hidden="true">Kaartlagen</h2>
            <CollapseIcon className="map-panel__toggle-icon map-panel__toggle-icon--expanded" />
            <ExpandIcon className="map-panel__toggle-icon map-panel__toggle-icon--collapsed" />
          </button>
        </div>
        <div className="scroll-wrapper">
          {this.props.activeMapLayers.length > 0 && (
            <MapLegend
              activeMapLayers={this.props.activeMapLayers}
              onLayerToggle={this.props.onLayerToggle}
              onLayerVisibilityToggle={this.props.onLayerVisibilityToggle}
              overlays={this.props.overlays}
              user={this.props.user}
              zoomLevel={this.props.zoomLevel}
            />
          )}
          <MapPanelHandle
            isMapPanelHandleVisible={this.props.isMapPanelHandleVisible}
            onMapPanelHandleToggle={this.props.onMapPanelHandleToggle}
          >
            <MapType
              activeBaseLayer={this.props.activeBaseLayer}
              baseLayers={this.props.mapBaseLayers}
              onBaseLayerToggle={this.props.onBaseLayerToggle}
            />
            <MapLayers
              activeMapLayers={this.props.activeMapLayers}
              layers={this.props.mapLayers}
              onLayerToggle={this.props.onLayerToggle}
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
  atlas: {},
  isMapPanelVisible: false,
  map: {},
  mapBaseLayers: {},
  mapLayers: [],
  user: {},
  zoomLevel: 0
};

MapPanelContainer.propTypes = {
  activeBaseLayer: PropTypes.string.isRequired,
  activeMapLayers: PropTypes.array, // eslint-disable-line
  atlas: PropTypes.object, // eslint-disable-line
  isEachOverlayInvisible: PropTypes.bool.isRequired,
  isMapPanelHandleVisible: PropTypes.bool.isRequired,
  isMapPanelVisible: PropTypes.bool,
  map: PropTypes.object, // eslint-disable-line
  mapBaseLayers: PropTypes.object, // eslint-disable-line
  mapLayers: PropTypes.array, // eslint-disable-line
  onBaseLayerToggle: PropTypes.func, // eslint-disable-line
  onLayerToggle: PropTypes.func, // eslint-disable-line
  onLayerVisibilityToggle: PropTypes.func, // eslint-disable-line
  onMapPanelHandleToggle: PropTypes.func, // eslint-disable-line
  onMapPanelToggle: PropTypes.func.isRequired,
  overlays: PropTypes.array, // eslint-disable-line
  user: PropTypes.object, // eslint-disable-line
  zoomLevel: PropTypes.number
};

export default connect(mapStateToProps, mapDispatchToProps)(MapPanelContainer);
