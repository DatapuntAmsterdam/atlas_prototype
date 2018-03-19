import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { toggleMapFullscreen } from '../../../shared/ducks/ui/ui';

import DrawTool from '../../containers/draw-tool/DrawToolContainer'; //eslint-disable-line
import ToggleFullscreen from '../../components/toggle-fullscreen/ToggleFullscreen';

const mapStateToProps = (state) => ({
  isFullscreen: state.ui.isMapFullscreen,
  map: state.map
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onToggleFullscreen: toggleMapFullscreen
}, dispatch);

class MapContainer extends React.Component { //eslint-disable-line
  constructor(props) { //eslint-disable-line
    super(props);
  }

  render() {
    return (
      <div className="c-map c-map--drawing-mode- qa-map-container">
        <ToggleFullscreen
          isFullscreen={this.props.isFullscreen}
          onToggleFullscreen={this.props.onToggleFullscreen}
        />
      </div>
    );
  }
}

MapContainer.contextTypes = {
  store: PropTypes.object.isRequired
};

MapContainer.defaultProps = {
  geometry: null
};

MapContainer.propTypes = {
  map: PropTypes.shape({}).isRequired, //eslint-disable-line
  isFullscreen: PropTypes.bool.isRequired,
  onToggleFullscreen: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MapContainer);
