import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import throttle from 'lodash.throttle';

import './PanoramaContainer.scss';
import {
  fetchPanoramaHotspotRequest,
  setPanoramaOrientation
} from '../ducks/actions';
import { toDataDetail, toGeoSearch } from '../../store/redux-first-router/actions';

import { getOrientation, initialize, loadScene } from '../services/marzipano/marzipano';

import StatusBar from '../components/StatusBar/StatusBar';
import ToggleFullscreen from '../../app/components/ToggleFullscreen/ToggleFullscreen';
import { getPanorama, getPanoramaLocation, getReference } from '../ducks/selectors';
import IconButton from '../../app/components/IconButton/IconButton';
import { getMapDetail } from '../../map/ducks/detail/map-detail';
import PARAMETERS from '../../store/parameters';
import { getMapOverlaysWithoutPanorama } from '../../map/ducks/map/map-selectors';
import { pageTypeToEndpoint } from '../../map/services/map-detail';
import { setViewMode, VIEW_MODE } from '../../shared/ducks/ui/ui';

class PanoramaContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.updateOrientation = this.updateOrientation.bind(this);
    this.hotspotClickHandler = this.hotspotClickHandler.bind(this);
    this.loadPanoramaScene = this.loadPanoramaScene.bind(this);

    this.updateOrientationThrottled = throttle(
      this.updateOrientation,
      300,
      {
        leading: true,
        trailing: true
      }
    );
  }

  componentDidMount() {
    const { detailReference, fetchMapDetail } = this.props;
    this.panoramaViewer = initialize(this.panoramaRef);
    this.loadPanoramaScene();

    if (this.panoramaViewer) {
      this.panoramaViewer.addEventListener('viewChange', this.updateOrientationThrottled);
    }

    if (detailReference.length > 0) {
      const [id, type, subtype] = detailReference;
      fetchMapDetail(pageTypeToEndpoint(type, subtype, id));
    }
  }

  componentDidUpdate(prevProps) {
    const { panoramaState } = this.props;

    if (panoramaState.image !== prevProps.panoramaState.image) {
      this.loadPanoramaScene();
    }
  }

  componentWillUnmount() {
    this.panoramaViewer.removeEventListener('viewChange', this.updateOrientationThrottled);
  }

  loadPanoramaScene() {
    const { panoramaState } = this.props;
    if (panoramaState.image) {
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
    const { isFullscreen, setView } = this.props;

    if (isFullscreen) {
      return setView(VIEW_MODE.SPLIT, 'beeld-verkleinen');
    }

    return setView(VIEW_MODE.FULL, 'beeld-vergroten');
  }

  render() {
    const {
      isFullscreen,
      panoramaState,
      onClose,
      detailReference,
      panoramaLocation,
      overlaysWithoutPanorama
    } = this.props;
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
        />

        <ToggleFullscreen
          isFullscreen={isFullscreen}
          title="Panoramabeeld"
          onToggleFullscreen={this.toggleFullscreen}
          alignLeft
        />

        <IconButton
          onClick={() => {
            onClose(panoramaLocation, detailReference, overlaysWithoutPanorama);
          }}
          title="Sluit panorama"
          icon="cross"
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
  detailReference: getReference(state),
  panoramaLocation: getPanoramaLocation(state),
  overlaysWithoutPanorama: getMapOverlaysWithoutPanorama(state)
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    setOrientation: setPanoramaOrientation,
    setView: setViewMode,
    fetchPanoramaById: fetchPanoramaHotspotRequest,
    fetchMapDetail: getMapDetail
  }, dispatch),
  // Todo: move to panorama
  onClose: (panoramaLocation, reference, overlaysWithoutPanorama) => {
    if (reference.length) {
      dispatch(toDataDetail(reference, {
        [PARAMETERS.LAYERS]: overlaysWithoutPanorama
      }));
    } else {
      dispatch(toGeoSearch({
        [PARAMETERS.LOCATION]: panoramaLocation,
        [PARAMETERS.VIEW]: VIEW_MODE.SPLIT,
        [PARAMETERS.LAYERS]: overlaysWithoutPanorama
      }));
    }
  }
});

PanoramaContainer.propTypes = {
  panoramaState: PropTypes.shape({}).isRequired,
  overlaysWithoutPanorama: PropTypes.arrayOf(PropTypes.object).isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  detailReference: PropTypes.arrayOf(PropTypes.string).isRequired,
  panoramaLocation: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
  setOrientation: PropTypes.func.isRequired,
  fetchMapDetail: PropTypes.func.isRequired,
  fetchPanoramaById: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaContainer);
