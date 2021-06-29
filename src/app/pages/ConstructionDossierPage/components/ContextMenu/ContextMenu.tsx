import { ChevronDown, Download, Ellipsis, Print } from '@amsterdam/asc-assets'
import { ContextMenu as AscContextMenu, ContextMenuItem, Icon } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import type { DossierFile } from '../ImageViewer/ImageViewer'
import socialItems from '../../../../components/ContextMenu/socialItems'

export interface ContextMenuProps {
  handleDownload: (imageUrl: string, fileName: string, size: string) => void
  file: DossierFile
  isImage: boolean
  downloadLoading: boolean
}

const ContextMenu: FunctionComponent<ContextMenuProps> = ({
  file,
  handleDownload,
  downloadLoading,
  isImage,
  ...otherProps
}) => {
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
        onClick={() => {
          window.print()
        }}
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
          onClick={() =>
            handleDownload(`${file.url}/full/800,/0/default.jpg`, file.filename, 'klein')
          }
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
          onClick={() =>
            handleDownload(`${file.url}/full/1600,/0/default.jpg`, file.filename, 'groot')
          }
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
            isImage ? `${file.url}/full/full/0/default.jpg` : `${file.url}?source_file=true`, // If the file is not an image the source file should be downloadable
            file.filename,
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
      {socialItems()}
    </AscContextMenu>
  )
}

export default ContextMenu
