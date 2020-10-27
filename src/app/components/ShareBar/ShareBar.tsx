import { Email, Facebook, Linkedin, Print, Twitter } from '@amsterdam/asc-assets'
import { ShareButton, themeSpacing } from '@amsterdam/asc-ui'
import React, { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { hasPrintMode, isPrintMode, sharePage, showPrintMode } from '../../../shared/ducks/ui/ui'
import getShareUrl from '../../../shared/services/share-url/share-url'

type Props = {
  hideInPrintMode?: boolean
  topSpacing?: number
}

const ShareBarContainer = styled.div<Props>`
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

const ShareBar: React.FC<Props> = ({ hideInPrintMode, ...otherProps }) => {
  const dispatch = useDispatch()

  const handlePageShare = useCallback(
    (target) => {
      dispatch(sharePage(target))

      const link = getShareUrl(target, window)
      if (link) {
        window.open(link.url, link.target)
      }
    },
    [dispatch],
  )
  const pageAbleToPrint = useSelector(hasPrintMode)
  const printMode = useSelector(isPrintMode)

  const showShareBar = (hideInPrintMode && !printMode) || !hideInPrintMode
  return showShareBar ? (
    <ShareBarContainer {...otherProps} data-testid="sharebar">
      <ShareButton
        // @ts-ignore
        type="button"
        onClick={() => handlePageShare('facebook')}
        hoverColor="#3b5999"
        iconSize={30}
        title="Deel op Facebook"
      >
        <Facebook />
      </ShareButton>
      <ShareButton
        // @ts-ignore
        type="button"
        onClick={() => handlePageShare('twitter')}
        hoverColor="#55acee"
        title="Deel op Twitter"
      >
        <Twitter />
      </ShareButton>
      <ShareButton
        // @ts-ignore
        type="button"
        onClick={() => handlePageShare('linkedin')}
        hoverColor="#0077B5"
        title="Deel op LinkedIn"
      >
        <Linkedin />
      </ShareButton>
      <ShareButton
        // @ts-ignore
        type="button"
        onClick={() => handlePageShare('email')}
        title="Deel via email"
      >
        <Email />
      </ShareButton>
      {pageAbleToPrint && (
        <ShareButton
          // @ts-ignore
          type="button"
          onClick={() => {
            dispatch(showPrintMode())
          }}
          title="Print deze pagina"
        >
          <Print />
        </ShareButton>
      )}
    </ShareBarContainer>
  ) : null
}

ShareBar.defaultProps = {
  hideInPrintMode: true,
}

export default ShareBar
