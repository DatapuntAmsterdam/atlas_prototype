import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  toDetailFromEndpoint,
  toPanoramaAndPreserveQuery,
  toMapAndPreserveQuery
} from '../../../store/redux-first-router/actions';
import { getDetailLocation } from '../../../store/redux-first-router/selectors';

import { selectNotClickableVisibleMapLayers } from '../../ducks/panel-layers/map-panel-layers';
import { selectLatestMapDetail } from '../../ducks/detail/map-detail';
import { isEmbedded, isEmbedPreview, setViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui';
import { getDetail, getDetailEndpoint } from '../../../shared/ducks/detail/selectors';
import MapPreviewPanel from './MapPreviewPanel';
import { getLocationId } from '../../ducks/map/map-selectors';
import { isGeoSearch } from '../../../shared/ducks/selection/selection';
import {
  getDataSearch,
  getDataSearchLocation,
  getMapPanelResults,
  isSearchLoading
} from '../../../shared/ducks/data-search/selectors';
import { getPanoramaPreview } from '../../../panorama/ducks/preview/panorama-preview';

const mapStateToProps = (state) => ({
  panoPreview: getPanoramaPreview(state),
  searchResults: getMapPanelResults(state),
  dataQuerySearch: getDataSearch(state),
  detailLocation: getDetailLocation(state),
  searchLocation: getDataSearchLocation(state),
  searchLocationId: getLocationId(state),
  isSearchLoaded: !isSearchLoading(state) && getMapPanelResults(state),
  missingLayers: selectNotClickableVisibleMapLayers(state)
    .map((mapLayer) => mapLayer.title)
    .join(', '),
  detail: getDetail(state),
  detailEndpoint: getDetailEndpoint(state),
  mapDetail: state.mapDetail,
  detailResult: selectLatestMapDetail(state) || null,
  user: state.user,
  isEmbed: isEmbedPreview(state) || isEmbedded(state),
  isSearchPreview: isGeoSearch(state)
});

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators({
    closePanel: toMapAndPreserveQuery,
    onSearchMaximize: setViewMode,
    openPano: toPanoramaAndPreserveQuery
  }, dispatch),
  openPreviewDetail: (endpoint) => dispatch(toDetailFromEndpoint(endpoint, VIEW_MODE.MAP)),
  openDetail: (endpoint) => dispatch(toDetailFromEndpoint(endpoint, VIEW_MODE.SPLIT))
});

/* eslint-enable react/no-unused-prop-types */
export default connect(mapStateToProps, mapDispatchToProps)(MapPreviewPanel);
