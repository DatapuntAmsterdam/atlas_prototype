import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from '@datapunt/asc-core'
import { Facebook, Twitter, Linkedin, Email, Print } from '@datapunt/asc-assets'
import { ShareButton } from '@datapunt/asc-ui'
import { hasPrintMode, showPrintMode, sharePage } from '../../../shared/ducks/ui/ui'
import getShareUrl from '../../../shared/services/share-url/share-url'

const ShareBarContainer = styled.div`
  display: flex;

  & > * {
    margin-right: 5px;
  }
`

const ShareBar = ({ hasPrintButton, openSharePage, openPrintMode }) => {
  const handlePageShare = target => {
    openSharePage(target)

    const link = getShareUrl(target, window)
    window.open(link.url, link.target)
  }

  return (
    <ShareBarContainer>
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
}

ShareBar.defaultProps = {
  hasPrintButton: false,
}

ShareBar.propTypes = {
  hasPrintButton: PropTypes.bool,
  openSharePage: PropTypes.func.isRequired,
  openPrintMode: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  hasPrintButton: hasPrintMode(state),
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
