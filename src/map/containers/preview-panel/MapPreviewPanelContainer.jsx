import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  fetchSearchResults,
  maximizeMapPreviewPanel
} from '../../ducks/preview-panel/map-preview-panel';
import { clearSelectedLocation } from '../../ducks/map/map';
import { selectNotClickableVisibleMapLayers } from '../../ducks/panel-layers/map-panel-layers';
import { selectLatestMapDetail } from '../../ducks/detail/map-detail';
import { toggleMapFullscreen } from '../../../shared/ducks/ui/ui';
import { fetchStraatbeeldById } from '../../ducks/straatbeeld/straatbeeld';
import { fetchDetail as legacyFetchDetail } from '../../../reducers/details';
import MapPreviewPanel from './MapPreviewPanel';
import {
  getLocationId,
  getSelectedLocation,
  getShortSelectedLocation,
  selectLatestMapSearchResults
} from '../../ducks/map/map-selectors';

const mapStateToProps = (state) => ({
  mapClickLocation: getSelectedLocation(state),
  pano: state.pano,
  results: selectLatestMapSearchResults(state),
  search: state.search,
  searchLocation: getShortSelectedLocation(state),
  searchLocationId: getLocationId(state),
  missingLayers: selectNotClickableVisibleMapLayers(state)
    .map((mapLayer) => mapLayer.title)
    .join(', '),
  detail: state.detail,
  mapDetail: state.mapDetail,
  detailResult: selectLatestMapDetail(state) || {},
  user: state.user,
  isEmbed: state.ui && (state.ui.isEmbed || state.ui.isEmbedPreview)
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  onSearch: fetchSearchResults,
  onMapPreviewPanelClose: clearSelectedLocation,
  onMapPreviewPanelMaximize: maximizeMapPreviewPanel,
  onMapSearchResultsItemClick: legacyFetchDetail,
  onOpenPanoById: fetchStraatbeeldById,
  closeMapFullScreen: toggleMapFullscreen
}, dispatch);

/* eslint-enable react/no-unused-prop-types */
export default connect(mapStateToProps, mapDispatchToProps)(MapPreviewPanel);
