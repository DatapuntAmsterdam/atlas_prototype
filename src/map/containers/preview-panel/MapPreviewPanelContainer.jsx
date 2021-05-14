import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { legendOpenParam, viewParam } from '../../../app/pages/MapPage/query-params'
import {
  getDataSearch,
  getDataSearchLocation,
  getMapPanelResults,
  isSearchLoading,
} from '../../../shared/ducks/data-search/selectors'
import { getDetail } from '../../../shared/ducks/detail/selectors'
import { isGeoSearch } from '../../../shared/ducks/selection/selection'
import { isEmbedded, isEmbedPreview, setViewMode, ViewMode } from '../../../shared/ducks/ui/ui'
import {
  toDataDetail,
  toDetailFromEndpoint,
  toMapAndPreserveQuery,
  toPanoramaAndPreserveQuery,
} from '../../../store/redux-first-router/actions'
import { getDetailLocation, getPage } from '../../../store/redux-first-router/selectors'
import { selectLatestMapDetail } from '../../ducks/detail/selectors'
import { getLocationId } from '../../ducks/map/selectors'
import { selectNotClickableVisibleMapLayers } from '../../ducks/panel-layers/map-panel-layers'
import MapPreviewPanel from './MapPreviewPanel'

const mapStateToProps = (state) => ({
  searchResults: getMapPanelResults(state),
  dataSearch: getDataSearch(state),
  currentPage: getPage(state),
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
  openPreviewDetail: (detail) => dispatch(toDetailFromEndpoint(detail, ViewMode.Map)),
  openDetail: ({ id, type, subtype }) =>
    dispatch(
      toDataDetail([id, type, subtype], {
        [viewParam.name]: ViewMode.Split,
        [legendOpenParam.name]: false,
      }),
    ),
})

/* eslint-enable react/no-unused-prop-types */
export default connect(mapStateToProps, mapDispatchToProps)(MapPreviewPanel)
