import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  getPanoramaHeading,
  getPanoramaId,
  getPanoramaView
} from '../../panorama/ducks/panorama';
import PANORAMA_VIEW from '../../panorama/ducks/panorama-view';
import PanoramaContainer from '../../panorama/containers/PanoramaContainer';
import MapContainer from '../../map/containers/map/MapContainer';
import { toPanorama as toPanoramaActionCreator } from '../../store/redux-first-router';
import SplitScreen from '../components/SplitScreen/SplitScreen';

/* istanbul ignore next */ // TODO: refactor, test
const PanoramaPage = ({ id, heading, view, toPanorama }) => {
  const openPanoView = (newView) => toPanorama(id, heading, newView);

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
  id: PropTypes.string.isRequired,
  heading: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  toPanorama: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  heading: getPanoramaHeading(state),
  id: getPanoramaId(state),
  view: getPanoramaView(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toPanorama: toPanoramaActionCreator
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaPage);
