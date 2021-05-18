import {
  breakpoint,
  ImageCard,
  ImageCardContent,
  Link,
  styles,
  themeColor,
  Typography,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { Theme } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import type { NormalizedFieldItems } from '../../../normalizations/cms/types'

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
    }
  }
`

const StyledImageCard = styled(ImageCard)`
  pointer-events: none; /* FF 60 fix */
`

interface HighlightCardProps
  extends Pick<NormalizedFieldItems, 'shortTitle' | 'title' | 'linkProps'> {
  loading: boolean
  showError: boolean
  teaserImage?: string | null
  styleAs?: keyof Theme.TypographyElements
}

const HighlightCard: FunctionComponent<HighlightCardProps> = ({
  loading,
  showError,
  title,
  shortTitle,
  linkProps,
  teaserImage,
  styleAs,
}) =>
  teaserImage ? (
    <StyledLink {...linkProps} variant="blank">
      <StyledImageCard
        backgroundImage={teaserImage}
        isLoading={loading || showError}
        animateLoading={!showError}
        // @ts-ignore
        alt={shortTitle ?? title ?? ''}
      >
        <ImageCardContent>
          <HighlightCardHeadingStyle forwardedAs="span" styleAs={styleAs ?? 'h4'}>
            {shortTitle || title}
          </HighlightCardHeadingStyle>
        </ImageCardContent>
      </StyledImageCard>
    </StyledLink>
  ) : null

export default HighlightCard
