import {
  breakpoint,
  ImageCard,
  ImageCardContent,
  Link,
  styles,
  themeColor,
  Typography,
} from '@datapunt/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'
import focusOutline from '../shared/focusOutline'

const HighlightCardHeadingStyle = styled(Typography)`
  margin: 0;

  // Hard overwrite specifically for this component
  @media screen and ${breakpoint('max-width', 'mobileL')} {
    font-size: 18px;
    line-height: 23px;
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

    ${styles.ImageCardStyle} {
      position: relative;

      ${focusOutline()}
    }
  }
`

const StyledImageCard = styled(ImageCard)`
  pointer-events: none; /* FF 60 fix */
`

const HighlightCard = ({
  loading,
  showError,
  title,
  shortTitle,
  linkProps,
  teaserImage,
  styleAs,
}) => (
  <StyledLink {...linkProps} linkType="blank">
    <StyledImageCard
      backgroundImage={teaserImage}
      isLoading={loading || showError}
      animateLoading={!showError}
      alt={shortTitle || title}
    >
      <ImageCardContent>
        <HighlightCardHeadingStyle forwardedAs="span" styleAs={styleAs || 'h4'}>
          {shortTitle || title}
        </HighlightCardHeadingStyle>
      </ImageCardContent>
    </StyledImageCard>
  </StyledLink>
)

HighlightCard.defaultProps = {
  loading: false,
  showError: false,
  shortTitle: '',
  title: '',
  teaserImage: '',
  to: null,
}

HighlightCard.propTypes = {
  loading: PropTypes.bool,
  showError: PropTypes.bool,
  title: PropTypes.string,
  shortTitle: PropTypes.string,
  teaserImage: PropTypes.string,
  to: PropTypes.shape({}),
}

export default HighlightCard
