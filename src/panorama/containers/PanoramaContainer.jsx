import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './PanoramaContainer.scss';
import { getHotspots, getPanorama, setPanoramaOrientation } from '../ducks/panorama';
import { isPrintMode } from '../../shared/ducks/ui/ui';
import { getMapCenter } from '../../map/ducks/map/map-selectors';
import { toDataSearchLocation } from '../../store/redux-first-router';

import { initialize, loadScene, getOrientation } from '../services/marzipano/marzipano';

import StatusBar from '../components/StatusBar/StatusBar';

class PanoramaContainer extends React.Component {
  constructor() {
    super();
    this.updateOrientation = this.updateOrientation.bind(this);
  }

  componentDidMount() {
    this.panoramaViewer = initialize(this.panoramaRef);
  }

  componentDidUpdate(prevProps) {
    const { panoramaState } = this.props;
    if (panoramaState.image !== prevProps.panoramaState.image) {
      loadScene(
        this.panoramaViewer,
        panoramaState.image,
        panoramaState.heading,
        panoramaState.pitch,
        panoramaState.fov,
        panoramaState.hotspots
      );
    }
  }

  updateOrientation() {
    const { heading, pitch, fov } = getOrientation(this.panoramaViewer);
    this.props.setOrientation({ heading, pitch, fov });
  }

  render() {
    const { panoramaState } = this.props;

    return (
      <div className="c-panorama">
        <div
          ref={(el) => this.panoramaRef = el}
          role="button"
          className="c-panorama__marzipano js-marzipano-viewer"
          onMouseDown={this.updateOrientation}
        />

        {(panoramaState.date && panoramaState.location) ? (
          <StatusBar
            date={panoramaState.date}
            location={panoramaState.location}
            heading={panoramaState.heading}
            history={panoramaState.history}
          />
        ) : ''}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  panoramaState: getPanorama(state),
  hotspots: getHotspots(state),
  isPrint: isPrintMode(state),
  // Todo: DP-6312: get the location from selection reducer
  locationString: getMapCenter(state).join(',')
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  doClose: toDataSearchLocation,
  setOrientation: setPanoramaOrientation
}, dispatch);

PanoramaContainer.propTypes = {
  panoramaState: PropTypes.shape({}).isRequired
  // isFullscreen: PropTypes.bool.isRequired,
  // doClose: PropTypes.func.isRequired,
  // isPrint: PropTypes.bool.isRequired,
  // locationString: PropTypes.string.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaContainer);
