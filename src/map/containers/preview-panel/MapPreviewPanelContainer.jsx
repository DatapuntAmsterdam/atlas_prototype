import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { selectNotClickableVisibleMapLayers } from '../../ducks/panel-layers/map-panel-layers';
import { selectLatestMapDetail } from '../../ducks/detail/map-detail';
import { isEmbedded, isEmbedPreview } from '../../../shared/ducks/ui/ui';
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
import {
  getPageActionEndpoint,
  toDataSearchLocationAndPreserveQuery,
  toMap,
  toPanorama
} from '../../../store/redux-first-router';
import { DETAIL_VIEW } from '../../../shared/ducks/detail/constants';

const mapStateToProps = (state) => ({
  panoPreview: getPanoramaPreview(state),
  searchResults: getMapPanelResults(state),
  dataSearch: getDataSearch(state),
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
    closePanel: toMap,
    onSearchMaximize: toDataSearchLocationAndPreserveQuery
  }, dispatch),
  openPano: (id, heading) => {
    const action = toPanorama(id, heading);
    return dispatch(action);
  },
  openPreviewDetail: (endpoint) => dispatch(getPageActionEndpoint(endpoint, DETAIL_VIEW.MAP)),
  openDetail: (endpoint) => dispatch(getPageActionEndpoint(endpoint, DETAIL_VIEW.MAP_DETAIL))
});

/* eslint-enable react/no-unused-prop-types */
export default connect(mapStateToProps, mapDispatchToProps)(MapPreviewPanel);
