import styled, { css } from '@datapunt/asc-core'
import {
  breakpoint,
  Heading,
  ImageCard,
  ImageCardContent,
  Link,
  styles,
  themeColor,
} from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import { focusOutline } from './services/styles'

const HighlightCardHeadingStyle = styled(Heading)`
  margin: 0;

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    // Check why compact theme is not working as expected
    font-size: 14px;
    line-height: 17px;

    ${({ large }) =>
      large &&
      css`
        font-size: 20px;
        line-height: 1.2;
      `}

  @media screen and ${breakpoint('min-width', 'tabletM')} and ${breakpoint(
  'max-width',
  'laptopM',
)} {
      // Check why compact theme is not working as expected
      font-size: 14px;
      line-height: 17px;
    }

    @media screen and ${breakpoint('max-width', 'mobileL')} {
      font-size: 20px;
      line-height: 1.2;
    }
`

const StyledLink = styled(Link)`
  position: relative;
  width: 100%;

  &:hover {
    ${HighlightCardHeadingStyle} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }

  &:focus {
    background: none;

    ${/* sc-selector */ styles.ImageCardStyle}::after {
      ${focusOutline()}
    }
  }
`

const HighlightCard = ({
  loading,
  showError,
  title,
  shortTitle,
  to,
  teaserImage,
  ...otherProps
}) => (
  <StyledLink to={to} $as={RouterLink} linkType="blank">
    <ImageCard
      backgroundImage={teaserImage}
      loading={loading || showError}
      animateLoading={!showError}
      alt={shortTitle || title}
    >
      <ImageCardContent>
        <HighlightCardHeadingStyle $as="h4" {...otherProps}>
          {shortTitle || title}
        </HighlightCardHeadingStyle>
      </ImageCardContent>
    </ImageCard>
  </StyledLink>
)

export default HighlightCard
