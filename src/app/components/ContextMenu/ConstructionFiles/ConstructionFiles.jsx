import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ChevronDown, Ellipsis, Print, Download } from '@datapunt/asc-assets'
import { ContextMenu, ContextMenuItem, Icon } from '@datapunt/asc-ui'
import socialItems from '../socialItems'
import { sharePage, showPrintMode } from '../../../../shared/ducks/ui/ui'
import useDownload from '../../../utils/useDownload'
import getState from '../../../../shared/services/redux/get-state'

const ConstructionFiles = ({
  openSharePage,
  fileName,
  fileUrl,
  openPrintMode,
  onDownload,
  isImage,
}) => {
  const { accessToken } = getState().user

  const [loading, downloadFile] = useDownload()
  const handleDownload = (trackEvent, imageUrl) => async () => {
    await downloadFile(
      imageUrl,
      {
        method: 'get',
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      },
      fileName,
    )
    onDownload(trackEvent)
  }

  return (
    <ContextMenu
      data-test="context-menu"
      tabindex={0}
      alt="Actiemenu"
      arrowIcon={<ChevronDown />}
      icon={
        <Icon padding={4} inline size={24}>
          <Ellipsis />
        </Icon>
      }
      position="bottom"
    >
      <ContextMenuItem
        role="button"
        onClick={openPrintMode}
        icon={
          <Icon padding={4} inline size={24}>
            <Print />
          </Icon>
        }
      >
        Printen
      </ContextMenuItem>
      {isImage && (
        <>
          <ContextMenuItem
            as="button"
            disabled={loading}
            download={`${fileName}_small`}
            onClick={handleDownload('klein', `${fileUrl}/full/800,/0/default.jpg`, fileName)}
            icon={
              <Icon inline size={24} padding={4}>
                <Download />
              </Icon>
            }
          >
            Download klein
          </ContextMenuItem>
          <ContextMenuItem
            as="button"
            disabled={loading}
            download={`${fileName}_large`}
            onClick={handleDownload('groot', `${fileUrl}/full/1600,/0/default.jpg`, fileName)}
            icon={
              <Icon inline size={24} padding={4}>
                <Download />
              </Icon>
            }
          >
            Download groot
          </ContextMenuItem>
        </>
      )}
      <ContextMenuItem
        as="button"
        disabled={loading}
        download={`${fileName}_original`}
        divider
        onClick={handleDownload(
          'origineel',
          isImage ? `${fileUrl}/full/full/0/default.jpg` : `${fileUrl}?source_file=true`, // If the file is not an image the source file should be downloadable
          fileName,
        )}
        icon={
          <Icon inline size={24} padding={4}>
            <Download />
          </Icon>
        }
      >
        Download origineel
      </ContextMenuItem>
      {socialItems(openSharePage)}
    </ContextMenu>
  )
}

ConstructionFiles.propTypes = {
  openSharePage: PropTypes.func.isRequired,
  openPrintMode: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
  fileUrl: PropTypes.string.isRequired,
  isImage: PropTypes.bool.isRequired,
}

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openSharePage: sharePage,
      openPrintMode: showPrintMode,
    },
    dispatch,
  )

export default connect(null, mapDispatchToProps)(ConstructionFiles)
