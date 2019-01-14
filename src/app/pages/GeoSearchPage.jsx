import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import MapContainer from '../../map/containers/map/MapContainer';
import SplitScreen from '../components/SplitScreen/SplitScreen';
import LocationSearchContainer from '../containers/LocationSearchContainer';
import { getView } from '../../shared/ducks/data-search/selectors';
import { setView as setViewAction } from '../../shared/ducks/data-search/actions';
import { VIEWS } from '../../shared/ducks/data-search/constants';

const GeoSearchPage = ({ setView, view }) => {
  if (view === VIEWS.MAP) {
    return (
      <MapContainer
        showPreviewPanel
        isFullscreen
      />
    );
  }
  return (
    <SplitScreen
      leftComponent={(
        <MapContainer isFullscreen={false} toggleFullscreen={() => setView(VIEWS.MAP)} />
      )}
      rightComponent={(
        <LocationSearchContainer />
      )}
    />
  );
};

const mapStateToProps = (state) => ({
  view: getView(state)
});

const mapDispatchToProps = (dispatch) => ({
  setView: (view) => dispatch(setViewAction(view))
});

GeoSearchPage.propTypes = {
  setView: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(GeoSearchPage);
