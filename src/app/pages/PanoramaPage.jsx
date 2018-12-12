import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPanoramaView } from '../../shared/ducks/panorama/selectors';
import PANORAMA_VIEW from '../../shared/ducks/panorama/panorama-view';
import PanoramaContainer from '../containers/PanoramaContainer';
import MapContainer from '../../map/containers/map/MapContainer';
import SplitScreen from '../components/SplitScreen/SplitScreen';
import { setView } from '../../shared/ducks/panorama/actions';

/* istanbul ignore next */ // TODO: refactor, test
const PanoramaPage = ({ view, setPanoramaView }) => {
  const openPanoView = (newView) => setPanoramaView(newView);

  switch (view) {
    case PANORAMA_VIEW.PANO:
      return (
        <PanoramaContainer isFullscreen />
      );
    case PANORAMA_VIEW.MAP:
      return (
        <MapContainer
          isFullscreen
          toggleFullscreen={() => openPanoView(PANORAMA_VIEW.MAP_PANO)}
        />
      );
    default: {
      return (
        <SplitScreen
          leftComponent={(
            <MapContainer
              isFullscreen={false}
              toggleFullscreen={() => openPanoView(PANORAMA_VIEW.MAP)}
            />
          )}
          rightComponent={(
            <PanoramaContainer isFullscreen={false} />
          )}
        />
      );
    }
  }
};

PanoramaPage.propTypes = {
  view: PropTypes.oneOf(Object.keys(PANORAMA_VIEW)).isRequired,
  setPanoramaView: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  view: getPanoramaView(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  setPanoramaView: setView
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaPage);
