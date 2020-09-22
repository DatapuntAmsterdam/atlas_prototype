import { Email, Facebook, Linkedin, Print, Twitter } from '@amsterdam/asc-assets'
import { ShareButton, themeSpacing } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled, { css } from 'styled-components'
import { hasPrintMode, isPrintMode, sharePage, showPrintMode } from '../../../shared/ducks/ui/ui'
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
  const handlePageShare = (target) => {
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
          title="Deel op Facebook"
        >
          <Facebook />
        </ShareButton>
        <ShareButton
          type="button"
          onClick={() => handlePageShare('twitter')}
          hoverColor="#55acee"
          title="Deel op Twitter"
        >
          <Twitter />
        </ShareButton>
        <ShareButton
          type="button"
          onClick={() => handlePageShare('linkedin')}
          hoverColor="#0077B5"
          title="Deel op LinkedIn"
        >
          <Linkedin />
        </ShareButton>
        <ShareButton type="button" onClick={() => handlePageShare('email')} title="Deel via email">
          <Email />
        </ShareButton>
        {hasPrintButton && (
          <ShareButton type="button" onClick={openPrintMode} title="Print deze pagina">
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

const mapStateToProps = (state) => ({
  hasPrintButton: hasPrintMode(state),
  printMode: isPrintMode(state),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      openSharePage: sharePage,
      openPrintMode: showPrintMode,
    },
    dispatch,
  )

export default connect(mapStateToProps, mapDispatchToProps)(ShareBar)
