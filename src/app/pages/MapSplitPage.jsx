import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MapContainer from '../../map/containers/map/MapContainer';
import DetailContainer from '../containers/DetailContainer';
import { getDetailEndpoint, getDetailGeometry } from '../../shared/ducks/detail/selectors';
import { toDetailFromEndpoint as endpointActionCreator } from '../../store/redux-first-router/actions';
import SplitScreen from '../components/SplitScreen/SplitScreen';
import DataSelection from '../components/DataSelection/DataSelection';
import { getSelectionType } from '../../shared/ducks/selection/selection';
import { getViewMode, isPrintMode, setViewMode as setViewModeAction, VIEW_MODE } from '../../shared/ducks/ui/ui';
import { getPage } from '../../store/redux-first-router/selectors';
import PAGES from '../pages';
import PanoramaContainer from '../../panorama/containers/PanoramaContainer';
import LocationSearchContainer from '../components/LocationSearch/LocationSearchContainer';

/* istanbul ignore next */ // TODO: refactor, test
const MapSplitPage = ({
  hasSelection,
  currentPage,
  setViewMode,
  viewMode,
  hasGeometry,
  printMode
}) => {
  let forceFullScreen = false;
  let mapProps = {};
  let Component;
  switch (currentPage) {
    case PAGES.DATA_DETAIL:
      // Todo: hack. fix this properly (UX wise or from info API response)
      forceFullScreen = !hasGeometry;
      Component = <DetailContainer />;
      mapProps = {
        showPreviewPanel: hasSelection
      };

      break;

    case PAGES.PANORAMA:
      Component = <PanoramaContainer isFullscreen={viewMode === VIEW_MODE.FULL} />;
      mapProps = {
        isFullscreen: true,
        toggleFullscreen: () => setViewMode(VIEW_MODE.SPLIT)
      };

      break;

    case PAGES.DATA_GEO_SEARCH:
      Component = <LocationSearchContainer />;
      mapProps = {
        showPreviewPanel: true
      };

      break;

    case PAGES.ADDRESSES:
    case PAGES.ESTABLISHMENTS:
    case PAGES.CADASTRAL_OBJECTS:
      Component = <DataSelection />;
      mapProps = {
        toggleFullscreen: () => setViewMode(VIEW_MODE.SPLIT)
      };

      break;

    default:
      mapProps = {
        showPreviewPanel: true
      };
  }

  if (viewMode === VIEW_MODE.FULL || forceFullScreen) {
    return Component;
  } else if (viewMode === VIEW_MODE.SPLIT && Component) {
    return (
      <SplitScreen
        leftComponent={(
          <MapContainer
            isFullscreen={false}
            toggleFullscreen={() => setViewMode(VIEW_MODE.MAP)}
          />
        )}
        rightComponent={Component}
        printMode={printMode}
      />
    );
  }
  return <MapContainer {...mapProps} />;
};

const mapStateToProps = (state) => ({
  hasGeometry: Boolean(getDetailGeometry(state)),
  endpoint: getDetailEndpoint(state),
  hasSelection: !!getSelectionType(state),
  viewMode: getViewMode(state),
  currentPage: getPage(state),
  printMode: isPrintMode(state)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getPageActionEndpoint: endpointActionCreator,
  setViewMode: setViewModeAction
}, dispatch);

MapSplitPage.propTypes = {
  hasGeometry: PropTypes.bool.isRequired,
  hasSelection: PropTypes.bool.isRequired,
  setViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  printMode: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(MapSplitPage);
