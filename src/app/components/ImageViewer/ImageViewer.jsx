import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import OpenSeadragon from 'openseadragon'
import PropTypes from 'prop-types'
import { Button } from '@datapunt/asc-ui'
import { Close, Enlarge, Minimise } from '@datapunt/asc-assets'
import ViewerControls from '../ViewerControls/ViewerControls'
import { resetFile } from '../../../shared/ducks/files/actions'
import getState from '../../../shared/services/redux/get-state'
import { ConstructionFiles as ContextMenu } from '../ContextMenu'

/* istanbul ignore next */
const ImageViewer = ({ handleResetFile, fileName, fileUrl, title, onDownloadFile }) => {
  const viewerRef = React.createRef()
  const [viewer, setViewerInstance] = React.useState(null)

  const { accessToken } = getState().user

  const fileExtension = fileName.split('.').pop()
  const isImage = !!fileExtension.toLowerCase().match(/(jpg|jpeg|png|gif)/)

  React.useEffect(() => {
    // Todo: retrieve the document title from the filename (filter)
    OpenSeadragon({
      element: viewerRef.current,
      preserveViewport: true,
      visibilityRatio: 1.0,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: true,
      showNavigationControl: false,
      showSequenceControl: false,
      loadTilesWithAjax: true,
      ajaxHeaders: {
        authorization: `Bearer ${accessToken || ''}`,
      },
      tileSources: [`${fileUrl}/info.json`],
    }).addHandler('open', ({ eventSource }) => {
      setViewerInstance(eventSource)
    })
  }, [])

  const zoomIn = () => {
    viewer.viewport.zoomBy(1.5)
  }

  const zoomOut = () => {
    const targetZoomLevel = viewer.viewport.getZoom() - 1
    const newZoomLevel = targetZoomLevel < 1 ? 1 : targetZoomLevel
    viewer.viewport.zoomTo(newZoomLevel)
  }

  return (
    <>
      <div ref={viewerRef} className="c-image-viewer" />
      {viewer && (
        <ViewerControls
          metaData={[title, fileName]}
          topRightComponent={
            <Button
              type="button"
              variant="blank"
              title="Bouwtekening sluiten"
              size={32}
              icon={<Close />}
              iconSize={15}
              onClick={handleResetFile}
            />
          }
          bottomRightComponent={
            <div>
              <Button
                type="button"
                variant="blank"
                title="Inzoomen"
                size={32}
                iconSize={12}
                onClick={zoomIn}
                icon={<Enlarge />}
              />
              <Button
                type="button"
                variant="blank"
                title="Uitzoomen"
                size={32}
                iconSize={12}
                onClick={zoomOut}
                icon={<Minimise />}
              />
            </div>
          }
          bottomLeftComponent={
            <ContextMenu
              onDownload={onDownloadFile}
              fileName={fileName}
              fileUrl={fileUrl}
              isImage={isImage}
            />
          }
        />
      )}
    </>
  )
}

ImageViewer.defaultProps = {
  fileName: '',
  title: '',
}

ImageViewer.propTypes = {
  fileName: PropTypes.string,
  title: PropTypes.string,
  handleResetFile: PropTypes.func.isRequired,
  onDownloadFile: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      handleResetFile: resetFile,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(ImageViewer)
