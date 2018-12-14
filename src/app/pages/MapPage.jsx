import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapContainer from '../../map/containers/map/MapContainer';
import { hasGeometryFilter as geometryFilterActive } from '../../shared/ducks/data-selection/selectors';
import { setView } from '../../shared/ducks/data-selection/actions';
import { VIEWS } from '../../shared/ducks/data-selection/constants';
import { getDataSearchLocation } from '../../shared/ducks/data-search/selectors';

/* istanbul ignore next */ // TODO: refactor, test
const MapPage = ({
  hasGeometryFilter,
  navigateToDatasets
}) => {
  const navigateAction = () => navigateToDatasets(VIEWS.MAP);
  const toggleAction = hasGeometryFilter ? navigateAction : undefined;
  return (<MapContainer
    showPreviewPanel
    isFullscreen
    toggleFullscreen={toggleAction}
  />);
};

MapPage.propTypes = {
  hasGeometryFilter: PropTypes.bool.isRequired,
  navigateToDatasets: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  hasSelectionLocation: getDataSearchLocation(state),
  hasGeometryFilter: geometryFilterActive(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  navigateToDatasets: setView
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MapPage);
