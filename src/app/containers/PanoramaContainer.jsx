import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { AngularWrapper } from 'react-angular';
import { getHotspots, getPanorama, getReference } from '../../shared/ducks/panorama/selectors';
import { isPrintMode } from '../../shared/ducks/ui/ui';
import { getMapCenter } from '../../map/ducks/map/map-selectors';
import { toDataDetail, toDataSearchLocation } from '../../store/redux-first-router';

const mapStateToProps = (state) => ({
  panoramaState: getPanorama(state),
  hotspots: getHotspots(state),
  isPrint: isPrintMode(state),
  // Todo: DP-6312: get the location from selection reducer
  locationString: getMapCenter(state).join(','),
  reference: getReference(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  doClose: toDataSearchLocation,
  toDetail: toDataDetail
}, dispatch);

const PanoramaContainer = ({
  panoramaState,
  doClose,
  hotspots,
  isFullscreen,
  isPrint,
  locationString,
  reference,
  toDetail
}) => (
  <AngularWrapper
    moduleName={'dpStraatbeeldWrapper'}
    component="dpStraatbeeld"
    dependencies={['atlas']}
    bindings={{
      state: panoramaState,
      doClose: () => (reference ? toDetail(...reference) : doClose(locationString)),
      hotspots,
      isFullscreen,
      // Todo: hack to trigger the resize, please fix when dpStraatbeeld component is
      // converted to react
      resize: isPrint
    }}
  />
);

PanoramaContainer.propTypes = {
  panoramaState: PropTypes.shape({}).isRequired,
  hotspots: PropTypes.array.isRequired, // eslint-disable-line react/forbid-prop-types
  isFullscreen: PropTypes.bool.isRequired,
  doClose: PropTypes.func.isRequired,
  toDetail: PropTypes.func.isRequired,
  isPrint: PropTypes.bool.isRequired,
  locationString: PropTypes.string.isRequired,
  reference: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])).isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaContainer);
