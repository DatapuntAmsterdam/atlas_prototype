import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleMapFullscreen } from '../../../shared/ducks/ui/ui';

import LeafletDraw from '../../containers/leaflet-draw/LeafletDrawContainer';
import DrawTool from '../../containers/draw-tool/DrawToolContainer';
import ToggleFullscreen from '../../components/toggle-fullscreen/ToggleFullscreen';

const mapStateToProps = (state) => ({
  isFullscreen: state.ui.isMapFullscreen
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onToggleFullscreen: toggleMapFullscreen
}, dispatch);

const MapContainer = (props) => (
  <section className="map">
    <LeafletDraw />
    <DrawTool />
    <ToggleFullscreen
      isFullscreen={props.isFullscreen}
      onToggleFullscreen={props.onToggleFullscreen}
    />
  </section>
);


MapContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

MapContainer.defaultProps = {
  geometry: null
};

MapContainer.propTypes = {
  isFullscreen: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
