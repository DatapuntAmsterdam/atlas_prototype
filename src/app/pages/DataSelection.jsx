import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapContainer from '../../map/containers/map/MapContainer';
import NewDataSelection from '../components/DataSelection/DataSelection';
import { getDataSelectionView } from '../../shared/ducks/data-selection/selectors';
import SplitScreen from '../components/SplitScreen/SplitScreen';
import { VIEWS } from '../../shared/ducks/data-selection/constants';
import { setView } from '../../shared/ducks/data-selection/actions';


/* istanbul ignore next */ // TODO: refactor, test
const DataSelection = ({ view, toggleList, toggleMap }) => {
  if (view === VIEWS.MAP) {
    return (<MapContainer isFullscreen toggleFullscreen={toggleList} />);
  }
  if (view === VIEWS.LIST) {
    return (
      <SplitScreen
        leftComponent={(
          <MapContainer isFullscreen={false} toggleFullscreen={toggleMap} />
        )}
        rightComponent={(
          <NewDataSelection />
        )}
      />
    );
  }

  return (
    <NewDataSelection />
  );
};

DataSelection.propTypes = {
  view: PropTypes.string.isRequired,
  toggleList: PropTypes.func.isRequired,
  toggleMap: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  view: getDataSelectionView(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  toggleList: () => setView(VIEWS.LIST),
  toggleMap: () => setView(VIEWS.MAP)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DataSelection);
