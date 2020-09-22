import { ChevronDown, Ellipsis, Embed, Print } from '@amsterdam/asc-assets'
import { ContextMenu as ContextMenuComponent, ContextMenuItem, Icon } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  hasEmbedMode,
  hasPrintMode,
  sharePage,
  showEmbedPreview,
  showPrintMode,
} from '../../../../shared/ducks/ui/ui'
import socialItems from '../socialItems'

const Map = ({
  openSharePage,
  openPrintMode,
  openEmbedPreview,
  hasPrintButton,
  hasEmbedButton,
}) => (
  <section className="context-menu">
    <ContextMenuComponent
      data-test="context-menu"
      title="Actiemenu"
      arrowIcon={<ChevronDown />}
      icon={
        <Icon padding={4} inline size={24}>
          <Ellipsis />
        </Icon>
      }
      position="bottom"
    >
      {hasPrintButton ? (
        <ContextMenuItem
          role="button"
          data-test="print"
          divider={!hasEmbedButton}
          onClick={openPrintMode}
          icon={
            <Icon padding={4} inline size={24}>
              <Print />
            </Icon>
          }
        >
          Printen
        </ContextMenuItem>
      ) : (
        <></>
      )}
      {hasEmbedButton ? (
        <ContextMenuItem
          role="button"
          data-test="context-menu-embed"
          divider
          onClick={openEmbedPreview}
          icon={
            <Icon padding={4} inline size={24}>
              <Embed />
            </Icon>
          }
        >
          Embedden
        </ContextMenuItem>
      ) : (
        <></>
      )}
      {socialItems(openSharePage)}
    </ContextMenuComponent>
  </section>
)

Map.defaultProps = {
  hasPrintButton: false,
  hasEmbedButton: false,
}

Map.propTypes = {
  hasPrintButton: PropTypes.bool,
  hasEmbedButton: PropTypes.bool,
  openSharePage: PropTypes.func.isRequired,
  openPrintMode: PropTypes.func.isRequired,
  openEmbedPreview: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  hasPrintButton: hasPrintMode(state),
  hasEmbedButton: hasEmbedMode(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openSharePage: sharePage,
      openPrintMode: showPrintMode,
      openEmbedPreview: showEmbedPreview,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(Map)
