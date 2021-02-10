import PropTypes from 'prop-types'
import { lazy } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors'
import { getSelectionType } from '../../../shared/ducks/selection/selection'
import {
  getViewMode,
  isPrintMode,
  setViewMode as setViewModeAction,
  ViewMode,
} from '../../../shared/ducks/ui/ui'
import { toDetailFromEndpoint as endpointActionCreator } from '../../../store/redux-first-router/actions'
import { getPage } from '../../../store/redux-first-router/selectors'
import DataSelection from '../../components/DataSelection/DataSelection'
import SplitScreen from '../../components/SplitScreen/SplitScreen'
import PAGES from '../../pages'

const DataDetailPage = lazy(() =>
  import(/* webpackChunkName: "DataDetailPage" */ '../DataDetailPage/DataDetailPage'),
)
const LocationSearch = lazy(() =>
  import(
    /* webpackChunkName: "LocationSearchContainer" */ '../../components/LocationSearch/LocationSearch'
  ),
)
const PanoramaWrapper = lazy(() =>
  import(/* webpackChunkName: "PanoramaWrapper" */ '../../../panorama/containers/PanoramaWrapper'),
) // TODO: refactor, test

let MapComponent = () => null

if (typeof window !== 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
  MapComponent = require('../../../map/containers/map/MapContainer').default
}

/* istanbul ignore next */ const MapSplitPage = ({
  hasSelection,
  currentPage,
  setViewMode,
  viewMode,
  printMode,
}) => {
  let mapProps = {}
  let Component = null

  switch (currentPage) {
    case PAGES.DATA_DETAIL:
      Component = <DataDetailPage />
      mapProps = {
        showPreviewPanel: hasSelection,
      }

      break

    case PAGES.DATA:
      mapProps = {
        showPreviewPanel: false,
      }

      break

    case PAGES.PANORAMA: {
      Component = <PanoramaWrapper isFullscreen={viewMode === ViewMode.Full} />
      mapProps = {
        isFullscreen: true,
        toggleFullscreen: () => setViewMode(ViewMode.Split),
      }

      break
    }

    case PAGES.DATA_SEARCH_GEO:
      Component = <LocationSearch />
      mapProps = {
        showPreviewPanel: true,
      }

      break

    case PAGES.ADDRESSES:
    case PAGES.ESTABLISHMENTS:
    case PAGES.CADASTRAL_OBJECTS:
      Component = <DataSelection />
      mapProps = {
        toggleFullscreen: () => setViewMode(ViewMode.Split),
      }

      break

    default:
      mapProps = {
        showPreviewPanel: true,
      }
  }

  if (viewMode === ViewMode.Map) {
    return <MapComponent {...mapProps} />
  }
  if (Component) {
    if (viewMode === ViewMode.Full) {
      return Component
    }

    if (viewMode === ViewMode.Split) {
      return (
        <SplitScreen
          leftComponent={
            <MapComponent isFullscreen={false} toggleFullscreen={() => setViewMode(ViewMode.Map)} />
          }
          rightComponent={Component}
          printMode={printMode}
        />
      )
    }
  }

  return null
}

const mapStateToProps = (state) => ({
  endpoint: getDetailEndpoint(state),
  hasSelection: !!getSelectionType(state),
  viewMode: getViewMode(state),
  currentPage: getPage(state),
  printMode: isPrintMode(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      getPageActionEndpoint: endpointActionCreator,
      setViewMode: setViewModeAction,
    },
    dispatch,
  )

MapSplitPage.propTypes = {
  hasSelection: PropTypes.bool.isRequired,
  setViewMode: PropTypes.func.isRequired,
  viewMode: PropTypes.string.isRequired,
  currentPage: PropTypes.string.isRequired,
  printMode: PropTypes.bool.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(MapSplitPage)
