import { ControlButton } from '@amsterdam/arm-core'
import { Close } from '@amsterdam/asc-assets'
import { themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import classNames from 'classnames'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import { Component, createElement } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { Map as ContextMenu } from '../../app/components/ContextMenu'
import ToggleFullscreen from '../../app/components/ToggleFullscreen/ToggleFullscreen'
import { toHome } from '../../app/links'
import { getMapDetail } from '../../map/ducks/detail/actions'
import { getMapOverlays } from '../../map/ducks/map/selectors'
import { pageTypeToEndpoint } from '../../map/services/map-detail/map-detail'
import { isPrintMode, isPrintOrEmbedMode, setViewMode, ViewMode } from '../../shared/ducks/ui/ui'
import PARAMETERS from '../../store/parameters'
import { toDataDetail, toGeoSearch } from '../../store/redux-first-router/actions'
import PanoramaToggle from '../components/PanoramaToggle/PanoramaToggle'
import StatusBar from '../components/StatusBar/StatusBar'
import { fetchPanoramaHotspotRequest, setPanoramaOrientation } from '../ducks/actions'
import {
  getDetailReference,
  getLabelObjectByTags,
  getPageReference,
  getPanorama,
  getPanoramaLocation,
  getPanoramaTags,
} from '../ducks/selectors'
import {
  getHeadingDegrees,
  getOrientation,
  initialize,
  loadScene,
} from '../services/marzipano/marzipano'

const StyledControlButton = styled(ControlButton)`
  position: absolute;
  right: ${themeSpacing(2)};
  top: ${themeSpacing(2)};
  z-index: 1;
`

class PanoramaContainer extends Component {
  constructor(props) {
    super(props)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.updateOrientation = this.updateOrientation.bind(this)
    this.hotspotClickHandler = this.hotspotClickHandler.bind(this)
    this.loadPanoramaScene = this.loadPanoramaScene.bind(this)
    this.onClose = this.onClose.bind(this)

    this.updateOrientationDebounced = debounce(this.updateOrientation, 300, {
      leading: true,
      trailing: true,
    })
  }

  componentDidMount() {
    const { detailReference, fetchMapDetail } = this.props
    this.panoramaViewer = initialize(this.panoramaRef)
    this.loadPanoramaScene()

    if (this.panoramaViewer) {
      this.panoramaViewer.addEventListener('viewChange', this.updateOrientationDebounced)
    }

    if (detailReference.length > 0) {
      const [id, type, subtype] = detailReference
      fetchMapDetail(pageTypeToEndpoint(type, subtype, id))
    }
  }

  componentDidUpdate(prevProps) {
    const { panoramaState, printOrEmbedMode } = this.props

    if (panoramaState.image !== prevProps.panoramaState.image) {
      this.loadPanoramaScene()
    }

    if (printOrEmbedMode !== prevProps.printOrEmbedMode) {
      this.panoramaViewer = initialize(this.panoramaRef)
      this.loadPanoramaScene()
    }
  }

  componentWillUnmount() {
    this.panoramaViewer.removeEventListener('viewChange', this.updateOrientationDebounced)
  }

  onClose() {
    const { detailReference, pageReference, panoramaLocation, history, matomo } = this.props
    // Filter out the panorama layers, as they should be closed
    // eslint-disable-next-line react/destructuring-assignment
    const overlays = this.props.overlays?.filter(({ id }) => !id.startsWith('pano'))

    if (Array.isArray(detailReference) && detailReference.length) {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.toDataDetail(detailReference, {
        [PARAMETERS.LAYERS]: overlays,
        [PARAMETERS.VIEW]: ViewMode.Split,
      })
    } else if (pageReference === 'home') {
      history.push(toHome())
    } else {
      // eslint-disable-next-line react/destructuring-assignment
      this.props.toGeoSearch({
        [PARAMETERS.LOCATION]: panoramaLocation,
        [PARAMETERS.VIEW]: ViewMode.Split,
        [PARAMETERS.LAYERS]: overlays,
      })
    }

    matomo.trackEvent({
      category: 'navigation',
      action: 'panorama-verlaten',
      name: null,
    })
  }

  loadPanoramaScene() {
    const { panoramaState } = this.props
    const { heading: currentHeading, location, targetLocation } = panoramaState
    const heading =
      Array.isArray(location) && Array.isArray(targetLocation)
        ? getHeadingDegrees(location, targetLocation)
        : currentHeading
    if (panoramaState.image) {
      loadScene(
        this.panoramaViewer,
        this.hotspotClickHandler,
        panoramaState.image,
        heading,
        panoramaState.pitch,
        panoramaState.fov,
        panoramaState.hotspots,
      )
    }
  }

  updateOrientation() {
    const { setOrientation } = this.props
    const { heading, pitch, fov } = getOrientation(this.panoramaViewer)
    setOrientation({ heading, pitch, fov })
  }

  hotspotClickHandler(panoramaId) {
    const { fetchPanoramaById } = this.props
    return fetchPanoramaById({ id: panoramaId })
  }

  toggleFullscreen() {
    const { isFullscreen, setView } = this.props

    if (isFullscreen) {
      return setView(ViewMode.Split, 'beeld-verkleinen')
    }

    return setView(ViewMode.Full, 'beeld-vergroten')
  }

  render() {
    const { isFullscreen, printOrEmbedMode, printMode, panoramaState, tags } = this.props
    return (
      <div
        className={classNames({
          'c-panorama': true,
          'u-page-break-before': !isFullscreen,
        })}
        data-testid="panoramaContainer"
      >
        <div
          ref={
            // eslint-disable-next-line
            (el) => (this.panoramaRef = el)
          }
          role="button"
          tabIndex="-1"
          className="c-panorama__marzipano js-marzipano-viewer"
        />

        <ToggleFullscreen
          isFullscreen={isFullscreen}
          onToggleFullscreen={this.toggleFullscreen}
          alignLeft
          title="Panoramabeeld"
        />

        <StyledControlButton
          onClick={this.onClose}
          aria-label="Panoramabeeld sluiten"
          icon={<Close />}
          variant="blank"
          iconSize={20}
          size={40}
        />
        <div className="c-map__controls c-map__controls--bottom-left">
          {!printMode && panoramaState.location && (
            <PanoramaToggle
              location={panoramaState.location}
              heading={panoramaState.heading}
              currentLabel={getLabelObjectByTags(tags).label}
            />
          )}

          {!printOrEmbedMode && <ContextMenu />}
        </div>

        {panoramaState.date && panoramaState.location ? (
          <StatusBar
            date={panoramaState.date}
            location={panoramaState.location}
            heading={panoramaState.heading}
            currentLabel={getLabelObjectByTags(tags).label}
          />
        ) : (
          ''
        )}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  panoramaState: getPanorama(state),
  tags: getPanoramaTags(state),
  detailReference: getDetailReference(state),
  pageReference: getPageReference(state),
  panoramaLocation: getPanoramaLocation(state),
  overlays: getMapOverlays(state),
  printOrEmbedMode: isPrintOrEmbedMode(state),
  printMode: isPrintMode(state),
})

const mapDispatchToProps = (dispatch) => ({
  ...bindActionCreators(
    {
      setOrientation: setPanoramaOrientation,
      setView: setViewMode,
      fetchPanoramaById: fetchPanoramaHotspotRequest,
      fetchMapDetail: getMapDetail,
      toDataDetail,
      toGeoSearch,
    },
    dispatch,
  ),
})

PanoramaContainer.defaultProps = {
  printOrEmbedMode: false,
  printMode: false,
}

PanoramaContainer.propTypes = {
  panoramaState: PropTypes.shape({}).isRequired,
  isFullscreen: PropTypes.bool.isRequired,
  printOrEmbedMode: PropTypes.bool,
  printMode: PropTypes.bool,
  setView: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  detailReference: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOrientation: PropTypes.func.isRequired,
  fetchMapDetail: PropTypes.func.isRequired,
  fetchPanoramaById: PropTypes.func.isRequired,
  history: PropTypes.shape({}).isRequired,
  matomo: PropTypes.shape({}).isRequired,
}

const withHooks = (component) => (props) => {
  const history = useHistory()
  const matomo = useMatomo()

  return createElement(component, { history, matomo, ...props })
}

export default connect(mapStateToProps, mapDispatchToProps)(withHooks(PanoramaContainer))
