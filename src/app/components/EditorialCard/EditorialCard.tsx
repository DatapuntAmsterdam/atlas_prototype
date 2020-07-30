import {
  ascDefaultTheme,
  breakpoint,
  Card,
  CardContent,
  CardMedia,
  Heading,
  Image,
  Link,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import React from 'react'
import styled, { css } from 'styled-components'
import { CmsType, SpecialType } from '../../../shared/config/cms.config'
import getContentTypeLabel from '../../utils/getContentTypeLabel'
import getImageFromCms, { Resize } from '../../utils/getImageFromCms'

const notFoundImage = '/assets/images/not_found_thumbnail.jpg'

const getImageSize = (image: string, resize: Resize, imageSize: number) => {
  const small = Math.round(imageSize * 0.5)
  const medium = imageSize

  const srcSet = `${getImageFromCms(image, small, small, resize)} ${small}w,
             ${getImageFromCms(image, medium, medium, resize)} ${medium}w`

  const sizes = `
      ${ascDefaultTheme.breakpoints.mobileL('max-width')} ${small}px,
      ${ascDefaultTheme.breakpoints.tabletM('max-width')} ${medium}px,
    `

  return {
    srcSet,
    sizes,
  }
}

interface CardMediaProps {
  highlighted: boolean
  vertical?: boolean
  image?: string
  imageDimensions: [number, number]
}

const StyledCardMedia = styled(CardMedia)<CardMediaProps>`
  @media screen and ${breakpoint('max-width', 'tabletM')} {
    max-width: 80px;
    max-height: 80px;
    margin-right: ${themeSpacing(2)};
  }
  ${({ vertical, imageDimensions, highlighted }) => css`
    flex: 1 0 auto;
    max-width: ${imageDimensions[0]}px;
    max-height: ${imageDimensions[1]}px;

    ${!highlighted &&
    css`
      border: 1px solid ${themeColor('tint', 'level3')};
    `}

    &::before {
      padding-top: ${vertical ? '145%' : '100%'};
    }
  `}
`

const CustomCardMedia: React.FC<CardMediaProps> = ({
  highlighted,
  image,
  imageDimensions,
  ...otherProps
}) => {
  const imageIsVertical = imageDimensions[0] !== imageDimensions[1] // Image dimensions indicate whether the image is square or not

  return (
    <StyledCardMedia
      imageDimensions={imageDimensions}
      vertical={imageIsVertical}
      highlighted={highlighted}
      {...otherProps}
    >
      {/* Empty alt text necessary so screen-readers know this can be ignored, as it's already wrapped in a link with a heading */}
      <Image
        alt=""
        {...(image
          ? getImageSize(
              image,
              imageIsVertical ? 'fit' : 'fill',
              imageIsVertical ? imageDimensions[1] : imageDimensions[0],
            )
          : {})}
        src={image ? getImageFromCms(image, imageDimensions[0], imageDimensions[1]) : notFoundImage}
        square
      />
    </StyledCardMedia>
  )
}

const StyledHeading = styled(Heading)<{ compact: boolean }>`
  // By forwarding this component as h4, we need to overwrite the style rules in src/shared/styles/base/_typography.scss
  line-height: 22px;
  margin-bottom: ${({ compact }) => (compact ? themeSpacing(2) : themeSpacing(3))};
  width: fit-content;
  display: inline-block;
  font-weight: bold;
  ${({ compact }) =>
    compact &&
    css`
      font-size: 16px;
    `}
`

const ContentType = styled(Paragraph)`
  text-transform: uppercase;
  color: ${themeColor('primary')};
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
`

const StyledCardContent = styled(CardContent)<{ highlighted: boolean }>`
  display: flex;
  flex-direction: column;
  padding: ${themeSpacing(0, 0, 1, 0)};
  position: relative;
  min-height: 100%;

  ${({ highlighted }) =>
    !highlighted &&
    css`
      border-bottom: 1px solid ${themeColor('tint', 'level3')};
    `}
`

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(4)};
  width: 100%;

  &:hover,
  &:focus {
    background-color: inherit;

    ${StyledHeading} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }

    ${StyledCardContent} {
      border-color: ${({ compact }) =>
        compact ? themeColor('tint', 'level3') : themeColor('secondary')};
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const StyledCard = styled(Card)<{ highlighted: boolean }>`
  align-items: stretch;
  background-color: inherit;
  pointer-events: none; /* Make sure the right anchor click is registered */

  ${({ highlighted }) =>
    highlighted &&
    css`
      padding: ${themeSpacing(2)};
      border: ${themeColor('tint', 'level3')} 1px solid;
    `}

  &:last-child {
    margin-bottom: 0;
  }

  ${StyledCardMedia} + ${StyledCardContent} {
    @media screen and ${breakpoint('min-width', 'tabletM')} {
      margin-left: ${themeSpacing(4)};
    }
  }
`

const IntroText = styled(Paragraph)`
  padding-bottom: ${themeSpacing(4)};
  display: none;
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    display: inline-block;
  }
`

const MetaText = styled(Paragraph)`
  display: inline-block;
  color: ${themeColor('tint', 'level5')};
  font-size: 14px;
  line-height: 1.25;
  margin-top: auto;
  &::first-letter {
    text-transform: capitalize;
  }
`

interface EditorialCardProps {
  title: string
  description?: string
  type: CmsType
  specialType?: SpecialType
  date?: string
  image?: string
  imageDimensions?: [number, number]
  compact?: boolean
  showContentType?: boolean
  highlighted?: boolean
}

const EditorialCard: React.FC<EditorialCardProps> = ({
  title,
  description,
  type,
  specialType,
  date,
  image,
  imageDimensions = [400, 400],
  compact = false,
  showContentType = false,
  highlighted = false,
  ...otherProps
}) => {
  const contentTypeLabel = getContentTypeLabel(type, specialType)

  return (
    // Don't use the title attribute here, as we already use a heading that can be read by screen readers
    <StyledLink {...{ linkType: 'blank', ...otherProps }}>
      <StyledCard horizontal highlighted={highlighted}>
        <CustomCardMedia {...{ highlighted, image, imageDimensions }} />
        <StyledCardContent highlighted={highlighted}>
          {showContentType && contentTypeLabel && (
            <div>
              <ContentType data-testid="contentType">{contentTypeLabel}</ContentType>
            </div>
          )}

          <div>
            {/*
            // @ts-ignore */}
            <StyledHeading forwardedAs={compact ? 'span' : 'h3'} styleAs="h4" compact={compact}>
              {title}
            </StyledHeading>
          </div>

          {description && (
            <div>
              <IntroText dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}

          {date && (
            <MetaText as="time" data-testid="metaText" dateTime={date}>
              {specialType === SpecialType.Dashboard || specialType === SpecialType.Story
                ? `Laatst gewijzigd: ${date}`
                : date}
            </MetaText>
          )}
        </StyledCardContent>
      </StyledCard>
    </StyledLink>
  )
}

export default EditorialCard
