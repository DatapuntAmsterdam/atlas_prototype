import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { ChevronDown, Ellipsis, Print, Download } from '@datapunt/asc-assets'
import { ContextMenu, ContextMenuItem, Icon } from '@datapunt/asc-ui'
import socialItems from '../socialItems'
import { sharePage, showPrintMode } from '../../../../shared/ducks/ui/ui'

const ConstructionFiles = ({ openSharePage, fileName, openPrintMode, onDownload }) => (
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
    <ContextMenuItem
      as="a"
      role="button"
      download={`${fileName}_small`}
      target="_blank"
      href={`https://acc.images.data.amsterdam.nl/iiif/2/edepot:${fileName}/full/800,/0/default.jpg`}
      onClick={() => {
        onDownload('klein')
      }}
      icon={
        <Icon inline size={24} padding={4}>
          <Download />
        </Icon>
      }
    >
      Download klein
    </ContextMenuItem>
    <ContextMenuItem
      as="a"
      role="button"
      download={`${fileName}_large`}
      target="_blank"
      href={`https://acc.images.data.amsterdam.nl/iiif/2/edepot:${fileName}/full/1600,/0/default.jpg`}
      onClick={() => {
        onDownload('groot')
      }}
      icon={
        <Icon inline size={24} padding={4}>
          <Download />
        </Icon>
      }
    >
      Download groot
    </ContextMenuItem>
    <ContextMenuItem
      as="a"
      role="button"
      download={`${fileName}_original`}
      target="_blank"
      href={`https://acc.images.data.amsterdam.nl/iiif/2/edepot:${fileName}/full/full/0/default.jpg`}
      divider
      onClick={() => {
        onDownload('origineel')
      }}
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

ConstructionFiles.propTypes = {
  openSharePage: PropTypes.func.isRequired,
  openPrintMode: PropTypes.func.isRequired,
  onDownload: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openSharePage: sharePage,
      openPrintMode: showPrintMode,
    },
    dispatch,
  )

export default connect(
  null,
  mapDispatchToProps,
)(ConstructionFiles)
