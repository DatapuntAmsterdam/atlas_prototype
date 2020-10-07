import classNames from 'classnames'
import debounce from 'lodash.debounce'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Map as ContextMenu } from '../../app/components/ContextMenu'
import IconButton from '../../app/components/IconButton/IconButton'
import ToggleFullscreen from '../../app/components/ToggleFullscreen/ToggleFullscreen'
import { getMapDetail } from '../../map/ducks/detail/actions'
import { getMapOverlays } from '../../map/ducks/map/selectors'
import { pageTypeToEndpoint } from '../../map/services/map-detail/map-detail'
import { isPrintMode, isPrintOrEmbedMode, setViewMode, VIEW_MODE } from '../../shared/ducks/ui/ui'
import PanoramaToggle from '../components/PanoramaToggle/PanoramaToggle'
import StatusBar from '../components/StatusBar/StatusBar'
import {
  closePanorama,
  fetchPanoramaHotspotRequest,
  setPanoramaOrientation,
} from '../ducks/actions'
import {
  getDetailReference,
  getLabelObjectByTags,
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

class PanoramaContainer extends React.Component {
  constructor(props) {
    super(props)
    this.toggleFullscreen = this.toggleFullscreen.bind(this)
    this.updateOrientation = this.updateOrientation.bind(this)
    this.hotspotClickHandler = this.hotspotClickHandler.bind(this)
    this.loadPanoramaScene = this.loadPanoramaScene.bind(this)

    this.updateOrientationThrottled = debounce(this.updateOrientation, 300, {
      leading: true,
      trailing: true,
    })
  }

  componentDidMount() {
    const { detailReference, fetchMapDetail } = this.props
    this.panoramaViewer = initialize(this.panoramaRef)
    this.loadPanoramaScene()

    if (this.panoramaViewer) {
      this.panoramaViewer.addEventListener('viewChange', this.updateOrientationThrottled)
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
    this.panoramaViewer.removeEventListener('viewChange', this.updateOrientationThrottled)
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
      return setView(VIEW_MODE.SPLIT, 'beeld-verkleinen')
    }

    return setView(VIEW_MODE.FULL, 'beeld-vergroten')
  }

  render() {
    const { isFullscreen, printOrEmbedMode, printMode, panoramaState, onClose, tags } = this.props
    return (
      <div
        className={classNames({
          'c-panorama': true,
          'u-page-break-before': !isFullscreen,
        })}
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
          title="Panoramabeeld"
          onToggleFullscreen={this.toggleFullscreen}
          alignLeft
        />

        <IconButton onClick={onClose} title="Panoramabeeld sluiten" icon="cross" />
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
  pageReference: getDetailReference(state),
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
      onClose: closePanorama,
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
  onClose: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  detailReference: PropTypes.arrayOf(PropTypes.string).isRequired,
  setOrientation: PropTypes.func.isRequired,
  fetchMapDetail: PropTypes.func.isRequired,
  fetchPanoramaById: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(PanoramaContainer)
