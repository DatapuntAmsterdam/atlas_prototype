import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled, { css } from '@datapunt/asc-core'
import { Facebook, Twitter, Linkedin, Email, Print } from '@datapunt/asc-assets'
import { ShareButton, themeSpacing } from '@datapunt/asc-ui'
import { hasPrintMode, showPrintMode, sharePage, isPrintMode } from '../../../shared/ducks/ui/ui'
import getShareUrl from '../../../shared/services/share-url/share-url'

const ShareBarContainer = styled.div`
  display: flex;
  ${({ topSpacing }) =>
    topSpacing &&
    css`
      margin-top: ${themeSpacing(topSpacing)};
    `}

  & > * {
    margin-right: 5px;
  }
`

const ShareBar = ({
  hasPrintButton,
  openSharePage,
  openPrintMode,
  hideInPrintMode,
  printMode,
  ...otherProps
}) => {
  const handlePageShare = target => {
    openSharePage(target)

    const link = getShareUrl(target, window)
    window.open(link.url, link.target)
  }

  const showShareBar = (hideInPrintMode && !printMode) || !hideInPrintMode

  return (
    showShareBar && (
      <ShareBarContainer {...otherProps}>
        <ShareButton
          type="button"
          onClick={() => handlePageShare('facebook')}
          hoverColor="#3b5999"
          iconSize={30}
        >
          <Facebook />
        </ShareButton>
        <ShareButton type="button" onClick={() => handlePageShare('twitter')} hoverColor="#55acee">
          <Twitter />
        </ShareButton>
        <ShareButton type="button" onClick={() => handlePageShare('linkedin')} hoverColor="#0077B5">
          <Linkedin />
        </ShareButton>
        <ShareButton type="button" onClick={() => handlePageShare('email')}>
          <Email />
        </ShareButton>
        {hasPrintButton && (
          <ShareButton type="button" onClick={openPrintMode}>
            <Print />
          </ShareButton>
        )}
      </ShareBarContainer>
    )
  )
}

ShareBar.defaultProps = {
  hasPrintButton: false,
  hideInPrintMode: true,
}

ShareBar.propTypes = {
  hasPrintButton: PropTypes.bool,
  hideInPrintMode: PropTypes.bool,
  printMode: PropTypes.bool.isRequired,
  openSharePage: PropTypes.func.isRequired,
  openPrintMode: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  hasPrintButton: hasPrintMode(state),
  printMode: isPrintMode(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      openSharePage: sharePage,
      openPrintMode: showPrintMode,
    },
    dispatch,
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShareBar)
