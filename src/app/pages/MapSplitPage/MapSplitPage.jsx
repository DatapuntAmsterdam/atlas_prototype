import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { getDetailEndpoint } from '../../../shared/ducks/detail/selectors'
import { toDetailFromEndpoint as endpointActionCreator } from '../../../store/redux-first-router/actions'
import SplitScreen from '../../components/SplitScreen/SplitScreen'
import DataSelection from '../../components/DataSelection/DataSelectionContainer'
import { getSelectionType } from '../../../shared/ducks/selection/selection'
import {
  getViewMode,
  isPrintMode,
  setViewMode as setViewModeAction,
  VIEW_MODE,
} from '../../../shared/ducks/ui/ui'
import { getPage } from '../../../store/redux-first-router/selectors'
import PAGES from '../../pages'

const DataDetailPage = React.lazy(() =>
  import(/* webpackChunkName: "DataDetailPage" */ '../DataDetailPage/DataDetailPage'),
)
const LocationSearchContainer = React.lazy(() =>
  import(
    /* webpackChunkName: "LocationSearchContainer" */ '../../components/LocationSearch/LocationSearchContainer'
  ),
)
const PanoramaContainer = React.lazy(() =>
  import(
    /* webpackChunkName: "PanoramaContainer" */ '../../../panorama/containers/PanoramaContainer'
  ),
) // TODO: refactor, test

/* istanbul ignore next */ const MapSplitPage = ({
  hasSelection,
  currentPage,
  setViewMode,
  viewMode,
  printMode,
}) => {
  let mapProps = {}
  let Component = null

  let MapComponent = () => null

  if (typeof window !== 'undefined') {
    // eslint-disable-next-line global-require
    MapComponent = require('../../../map/containers/map/MapContainer').default
  }

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

    case PAGES.PANORAMA:
      Component = <PanoramaContainer isFullscreen={viewMode === VIEW_MODE.FULL} />
      mapProps = {
        isFullscreen: true,
        toggleFullscreen: () => setViewMode(VIEW_MODE.SPLIT),
      }

      break

    case PAGES.DATA_SEARCH_GEO:
      Component = <LocationSearchContainer />
      mapProps = {
        showPreviewPanel: true,
      }

      break

    case PAGES.ADDRESSES:
    case PAGES.ESTABLISHMENTS:
    case PAGES.CADASTRAL_OBJECTS:
      Component = <DataSelection />
      mapProps = {
        toggleFullscreen: () => setViewMode(VIEW_MODE.SPLIT),
      }

      break

    default:
      mapProps = {
        showPreviewPanel: true,
      }
  }

  if (viewMode === VIEW_MODE.MAP) {
    return <MapComponent {...mapProps} />
  }
  if (Component) {
    if (viewMode === VIEW_MODE.FULL) {
      return Component
    }

    if (viewMode === VIEW_MODE.SPLIT) {
      return (
        <SplitScreen
          leftComponent={
            <MapComponent
              isFullscreen={false}
              toggleFullscreen={() => setViewMode(VIEW_MODE.MAP)}
            />
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
