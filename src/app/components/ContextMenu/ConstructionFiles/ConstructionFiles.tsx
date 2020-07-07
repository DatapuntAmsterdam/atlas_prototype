import React from 'react'
import { useDispatch } from 'react-redux'
import { ChevronDown, Ellipsis, Print, Download } from '@datapunt/asc-assets'
import { ContextMenu, ContextMenuItem, Icon } from '@datapunt/asc-ui'
import socialItems from '../socialItems'
import { sharePage, showPrintMode } from '../../../../shared/ducks/ui/ui'

type ConstructionFilesProps = {
  handleDownload: (imageUrl: string, size: string) => void
  fileName: string
  fileUrl: string
  isImage: boolean
  downloadLoading: boolean
}

const ConstructionFiles: React.FC<ConstructionFilesProps> = ({
  fileName,
  fileUrl,
  handleDownload,
  downloadLoading,
  isImage,
}) => {
  const dispatch = useDispatch()

  const openSharePage = () => dispatch(sharePage())
  const openPrintMode = () => dispatch(showPrintMode())

  return (
    <ContextMenu
      data-test="context-menu"
      tabIndex={0}
      title="Actiemenu"
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
            forwardedAs="button"
            disabled={downloadLoading}
            download={`${fileName}_small`}
            onClick={() => handleDownload(`${fileUrl}/full/800,/0/default.jpg`, 'klein')}
            icon={
              <Icon inline size={24} padding={4}>
                <Download />
              </Icon>
            }
          >
            Download klein
          </ContextMenuItem>

          <ContextMenuItem
            forwardedAs="button"
            disabled={downloadLoading}
            download={`${fileName}_large`}
            onClick={() => handleDownload(`${fileUrl}/full/1600,/0/default.jpg`, 'groot')}
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
        forwardedAs="button"
        disabled={downloadLoading}
        download={`${fileName}_original`}
        divider
        onClick={() =>
          handleDownload(
            isImage ? `${fileUrl}/full/full/0/default.jpg` : `${fileUrl}?source_file=true`, // If the file is not an image the source file should be downloadable
            'origineel',
          )
        }
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

export default ConstructionFiles
