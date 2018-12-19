import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPanoramaView } from '../../panorama/ducks/selectors';
import MapContainer from '../../map/containers/map/MapContainer';
import SplitScreen from '../components/SplitScreen/SplitScreen';
import { setView } from '../../panorama/ducks/actions';
import PanoramaContainer from '../../panorama/containers/PanoramaContainer';
import PANORAMA_VIEW from '../../panorama/ducks/panorama-view';

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
