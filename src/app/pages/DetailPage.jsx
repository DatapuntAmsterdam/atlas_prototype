import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapContainer from '../../map/containers/map/MapContainer';
import DetailContainer from '../containers/DetailContainer';
import {
  getDetailEndpoint,
  getDetailGeometry,
  getDetailView
} from '../../shared/ducks/detail/selectors';
import { setView as setViewAction } from '../../shared/ducks/detail/actions';
import { toDetailFromEndpoint as endpointActionCreator } from '../../store/redux-first-router/actions';
import SplitScreen from '../components/SplitScreen/SplitScreen';
import { DETAIL_VIEW } from '../../shared/ducks/detail/constants';
import { getSelectionType } from '../../shared/ducks/selection/selection';

/* istanbul ignore next */ // TODO: refactor, test
const DetailPage = ({
  view: routeView,
  hasGeometry,
  hasSelection,
  setView
}) => {
  let view = routeView;
  if (routeView === DETAIL_VIEW.MAP_DETAIL) {
    // Hide map if no geometry is available
    view = hasGeometry ? DETAIL_VIEW.MAP_DETAIL : DETAIL_VIEW.DETAIL;
  }

  switch (view) {
    case DETAIL_VIEW.DETAIL:
      return (
        <DetailContainer />
      );
    case DETAIL_VIEW.MAP:
      return <MapContainer isFullscreen showPreviewPanel={hasSelection} />;
    default: {
      return (
        <SplitScreen
          leftComponent={(
            <MapContainer isFullscreen={false} toggleFullscreen={() => setView(DETAIL_VIEW.MAP)} />
          )}
          rightComponent={(
            <DetailContainer />
          )}
        />
      );
    }
  }
};

const mapStateToProps = (state) => ({
  hasGeometry: Boolean(getDetailGeometry(state)),
  view: getDetailView(state),
  endpoint: getDetailEndpoint(state),
  hasSelection: !!getSelectionType(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getPageActionEndpoint: endpointActionCreator,
  setView: setViewAction
}, dispatch);

DetailPage.propTypes = {
  hasGeometry: PropTypes.bool.isRequired,
  view: PropTypes.oneOf(Object.values(DETAIL_VIEW)).isRequired,
  hasSelection: PropTypes.bool.isRequired,
  setView: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailPage);
