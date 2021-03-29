import { ChevronDown, Download, Ellipsis, Print } from '@amsterdam/asc-assets'
import { ContextMenu as AscContextMenu, ContextMenuItem, Icon } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { useDispatch } from 'react-redux'
import { sharePage, showPrintMode } from '../../../../../shared/ducks/ui/ui'
import socialItems from '../../../../components/ContextMenu/socialItems'

export interface ContextMenuProps {
  handleDownload: (imageUrl: string, size: string) => void
  fileUrl: string
  isImage: boolean
  downloadLoading: boolean
}

const ContextMenu: FunctionComponent<ContextMenuProps> = ({
  fileUrl,
  handleDownload,
  downloadLoading,
  isImage,
  ...otherProps
}) => {
  const dispatch = useDispatch()

  const openSharePage = () => dispatch(sharePage())
  const openPrintMode = () => dispatch(showPrintMode())

  return (
    <AscContextMenu
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
      {...otherProps}
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
        <ContextMenuItem
          disabled={downloadLoading}
          onClick={() => handleDownload(`${fileUrl}/full/800,/0/default.jpg`, 'klein')}
          icon={
            <Icon inline size={24} padding={4}>
              <Download />
            </Icon>
          }
        >
          Download klein
        </ContextMenuItem>
      )}
      {isImage && (
        <ContextMenuItem
          disabled={downloadLoading}
          onClick={() => handleDownload(`${fileUrl}/full/1600,/0/default.jpg`, 'groot')}
          icon={
            <Icon inline size={24} padding={4}>
              <Download />
            </Icon>
          }
        >
          Download groot
        </ContextMenuItem>
      )}
      <ContextMenuItem
        disabled={downloadLoading}
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
    </AscContextMenu>
  )
}

export default ContextMenu