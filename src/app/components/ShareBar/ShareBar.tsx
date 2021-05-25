import { Email, Facebook, Linkedin, Print, Twitter } from '@amsterdam/asc-assets'
import { ShareButton, themeSpacing } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import styled, { css } from 'styled-components'
import getShareUrl from '../../../shared/services/share-url/share-url'

export interface ShareBarProps {
  hideInPrintMode?: boolean
  topSpacing?: number
}

const ShareBarContainer = styled.div<ShareBarProps>`
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

const ShareBar: FunctionComponent<ShareBarProps> = ({ hideInPrintMode, ...otherProps }) => {
  const handlePageShare = useCallback((target) => {
    const link = getShareUrl(target)
    if (link) {
      window.open(link.url, link.target)
    }
  }, [])

  return (
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
      <ShareButton
        // @ts-ignore
        type="button"
        onClick={() => {
          window.print()
        }}
        title="Print deze pagina"
      >
        <Print />
      </ShareButton>
    </ShareBarContainer>
  )
}

ShareBar.defaultProps = {
  hideInPrintMode: true,
}

export default ShareBar
