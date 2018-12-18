import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import './PanoramaContainer.scss';
import {
  getPanorama,
  setPanoramaOrientation,
  fetchPanoramaRequest
} from '../ducks/panorama';
import PANORAMA_VIEW from '../ducks/panorama-view';
import { getLocationLatLong } from '../../map/ducks/map/map-selectors';
import {
  toDataSearchLocation,
  toPanorama as toPanoramaActionCreator
} from '../../store/redux-first-router';

import { initialize, loadScene, getOrientation } from '../services/marzipano/marzipano';

import StatusBar from '../components/StatusBar/StatusBar';
import ToggleFullscreen from '../../app/components/ToggleFullscreen/ToggleFullscreen';

class PanoramaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.updateOrientation = this.updateOrientation.bind(this);
    this.hotspotClickHandler = this.hotspotClickHandler.bind(this);
  }

  componentDidMount() {
    this.panoramaViewer = initialize(this.panoramaRef);
  }

  componentDidUpdate(prevProps) {
    const { panoramaState } = this.props;
    if (panoramaState.image !== prevProps.panoramaState.image) {
      loadScene(
        this.panoramaViewer,
        this.hotspotClickHandler,
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

  hotspotClickHandler(panoramaId) {
    const { fetchPanoramaById } = this.props;
    return fetchPanoramaById({ id: panoramaId });
  }

  toggleFullscreen() {
    const { isFullscreen, panoramaState, toPanorama } = this.props;

    if (isFullscreen) {
      return toPanorama(panoramaState.id, panoramaState.heading, PANORAMA_VIEW.MAP_PANO);
    }

    return toPanorama(panoramaState.id, panoramaState.heading, PANORAMA_VIEW.PANO);
  }

  render() {
    const { isFullscreen, panoramaState } = this.props;

    return (
      <div className="c-panorama">
        <div
          ref={
            //eslint-disable-next-line
            (el) => this.panoramaRef = el
          }
          role="button"
          tabIndex="-1"
          className="c-panorama__marzipano js-marzipano-viewer"
          onMouseDown={this.updateOrientation}
        />

        <ToggleFullscreen
          isFullscreen={isFullscreen}
          title="Panoramabeeld"
          onToggleFullscreen={this.toggleFullscreen}
          alignLeft
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
  locationString: getLocationLatLong(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  closePanorama: toDataSearchLocation,
  toPanorama: toPanoramaActionCreator,
  setOrientation: setPanoramaOrientation,
  fetchPanoramaById: fetchPanoramaRequest
}, dispatch);

PanoramaContainer.defaultProps = {
  toPanorama: '',
  setOrientation: '',
  fetchPanoramaById: '',
  panoramaState: {}
};

PanoramaContainer.propTypes = {
  panoramaState: PropTypes.shape({}).isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  locationString: PropTypes.array, // eslint-disable-line
  toPanorama: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  setOrientation: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  fetchPanoramaById: PropTypes.oneOfType([PropTypes.string, PropTypes.func])

};

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaContainer);
