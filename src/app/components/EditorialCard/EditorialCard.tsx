import React from 'react'
import styled, { css } from 'styled-components'
import {
  ascDefaultTheme,
  Card,
  CardContent,
  CardMedia,
  Link,
  Heading,
  Paragraph,
  Image,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import getImageFromCms from '../../utils/getImageFromCms'
import getContentTypeLabel from '../../utils/getContentTypeLabel'
import { CmsType, SpecialType } from '../../../shared/config/cms.config'

const notFoundImage = '/assets/images/not_found_thumbnail.jpg'

const StyledHeading = styled(Heading)`
  // By forwarding this component as h4, we need to overwrite the style rules in src/shared/styles/base/_typography.scss
  line-height: 22px;
  margin-bottom: ${({ compact }) => (compact ? themeSpacing(2) : themeSpacing(3))};
  ${({ compact }) => compact && 'font-size: 16px;'}
  width: fit-content;
  display: inline-block;
  font-weight: bold;
`

const ContentType = styled(Paragraph)`
  text-transform: uppercase;
  color: ${themeColor('support', 'valid')};
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
`

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin-left: ${themeSpacing(4)};
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

const StyledCard = styled(Card)`
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
`

const StyledCardMedia = styled(CardMedia)`
  ${({ vertical, imageDimensions }) => css`
    flex: 1 0 auto;
    max-width: ${imageDimensions[0]}px;
    max-height: ${imageDimensions[1]}px;

    ${({ highlighted }) =>
      !highlighted &&
      css`
        border: 1px solid ${themeColor('tint', 'level3')};
      `}

    &::before {
      padding-top: ${vertical ? '145%' : '100%'};
    }
  `}
`

const IntroText = styled(Paragraph)`
  padding-bottom: ${themeSpacing(4)};
`

const MetaText = styled(Paragraph)`
  display: inline-block;
  color: ${themeColor('tint', 'level5')};
  padding-bottom: ${themeSpacing(4)};
  font-size: 14px;
  line-height: 1.25;
  margin-top: auto;
  &::first-letter {
    text-transform: capitalize;
  }
`

const getImageSize = (image, resize, imageSize) => {
  const small = Math.round(imageSize * 0.5)
  const medium = imageSize

  const srcSet = {
    srcSet: `${getImageFromCms(image, small, small, resize)} ${small}w,
             ${getImageFromCms(image, medium, medium, resize)} ${medium}w`,
  }

  const sizes = {
    sizes: `
      ${ascDefaultTheme.breakpoints.mobileL('max-width')} ${small}px,
      ${ascDefaultTheme.breakpoints.tabletM('max-width')} ${medium}px,
    `,
  }

  return {
    srcSet,
    sizes,
  }
}

interface EditorialCardProps {
  title: string
  description?: string
  type: CmsType
  specialType?: SpecialType
  date?: string
  image: string
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
  const imageIsVertical = imageDimensions[0] !== imageDimensions[1] // Image dimensions indicate whether the image is square or not

  const { srcSet, sizes } = getImageSize(
    image,
    imageIsVertical ? 'fit' : 'fill',
    imageIsVertical ? imageDimensions[1] : imageDimensions[0],
  )

  const contentTypeLabel = getContentTypeLabel(type, specialType)

  return (
    <StyledLink {...{ title, linkType: 'blank', compact, ...otherProps }}>
      <StyledCard horizontal highlighted={highlighted}>
        <StyledCardMedia
          imageDimensions={imageDimensions}
          vertical={imageIsVertical}
          highlighted={highlighted}
        >
          <Image
            {...(image ? { ...srcSet, ...sizes } : {})}
            src={getImageFromCms(image, imageDimensions[0], imageDimensions[1]) || notFoundImage}
            alt={title}
            square
          />
        </StyledCardMedia>
        <StyledCardContent highlighted={highlighted}>
          {showContentType && contentTypeLabel && (
            <div>
              <ContentType data-test="contentType">{contentTypeLabel}</ContentType>
            </div>
          )}

          <div>
            <StyledHeading
              forwardedAs={compact ? 'span' : 'h4'}
              compact={compact}
              hasMarginBottom={!!description}
            >
              {title}
            </StyledHeading>
          </div>

          {description && (
            <div>
              <IntroText dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}

          {date && (
            <div>
              <MetaText as="time" data-test="metaText" datetime={date}>
                {date}
              </MetaText>
            </div>
          )}
        </StyledCardContent>
      </StyledCard>
    </StyledLink>
  )
}

export default EditorialCard
