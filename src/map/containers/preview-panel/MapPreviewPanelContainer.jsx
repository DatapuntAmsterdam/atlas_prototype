import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  toDataDetail,
  toPanoramaAndPreserveQuery,
  toMapAndPreserveQuery,
  toDetailFromEndpoint,
} from '../../../store/redux-first-router/actions'
import { getDetailLocation } from '../../../store/redux-first-router/selectors'

import { selectNotClickableVisibleMapLayers } from '../../ducks/panel-layers/map-panel-layers'
import { selectLatestMapDetail } from '../../ducks/detail/selectors'
import { isEmbedded, isEmbedPreview, setViewMode, VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { getDetail } from '../../../shared/ducks/detail/selectors'
import MapPreviewPanel from './MapPreviewPanel'
import { getLocationId } from '../../ducks/map/selectors'
import { isGeoSearch } from '../../../shared/ducks/selection/selection'
import {
  getDataSearch,
  getDataSearchLocation,
  getMapPanelResults,
  isSearchLoading,
} from '../../../shared/ducks/data-search/selectors'
import { getPanoramaPreview } from '../../../panorama/ducks/preview/panorama-preview'
import PARAMETERS from '../../../store/parameters'

const mapStateToProps = (state) => ({
  panoPreview: getPanoramaPreview(state),
  searchResults: getMapPanelResults(state),
  dataSearch: getDataSearch(state),
  detailLocation: getDetailLocation(state),
  searchLocation: getDataSearchLocation(state),
  searchLocationId: getLocationId(state),
  isSearchLoaded: !isSearchLoading(state) && getMapPanelResults(state),
  missingLayers: selectNotClickableVisibleMapLayers(state)
    .map((mapLayer) => mapLayer.title)
    .join(', '),
  detail: getDetail(state),
  mapDetail: state.mapDetail,
  detailResult: selectLatestMapDetail(state) || null,
  user: state.user,
  isEmbed: isEmbedPreview(state) || isEmbedded(state),
  isSearchPreview: isGeoSearch(state),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      closePanel: toMapAndPreserveQuery,
      onSearchMaximize: setViewMode,
      openPano: toPanoramaAndPreserveQuery,
    },
    dispatch,
  ),
  openPreviewDetail: (detail) => dispatch(toDetailFromEndpoint(detail, VIEW_MODE.MAP)),
  openDetail: ({ id, type, subtype }) =>
    dispatch(
      toDataDetail([id, type, subtype], {
        [PARAMETERS.VIEW]: VIEW_MODE.SPLIT,
        [PARAMETERS.LEGEND]: false,
      }),
    ),
})

/* eslint-enable react/no-unused-prop-types */
export default connect(mapStateToProps, mapDispatchToProps)(MapPreviewPanel)
