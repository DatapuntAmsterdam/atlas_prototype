import styled, { css } from 'styled-components'
import {
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
import getImageFromCms from '../../utils/getImageFromCms'
import getContentTypeLabel from '../../utils/getContentTypeLabel'
import { CMSResultItem } from '../../utils/useFromCMS'

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
  width: 100%;
`

const StyledLink = styled(Link)`
  border-bottom: ${themeColor('tint', 'level3')} 1px solid;
  width: 100%;
  min-height: 66px;

  &:hover {
    border-bottom: ${themeColor('secondary')} 1px solid;

    ${StyledHeading} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }

  &:focus {
    background: none;
    position: relative;
  }
`

type StyledCardProps = {
  showError?: boolean
}

const StyledCard = styled(Card)<StyledCardProps>`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${themeSpacing(2)} 0;
  margin: ${themeSpacing(6)} 0;
  pointer-events: none; /* FF 60 fix */
  @media screen and ${breakpoint('min-width', 'tabletM')} {
    margin: ${themeSpacing(6, 2)};
  }
  ${({ showError }) =>
    showError &&
    css`
      background: ${themeColor('tint', 'level4')};
    `}
`
const StyledCardContent = styled(CardContent)`
  padding: 0;
  margin-right: ${themeSpacing(4)};
`

const StyledCardMedia = styled(CardMedia)`
  max-width: 80px;
  align-self: flex-start;
`
const ContentType = styled(Paragraph)`
  text-transform: uppercase;
  color: ${themeColor('primary')};
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
`

const EditorialBlockCard: React.FC<
  CMSResultItem &
    StyledCardProps & {
      loading?: boolean
      showContentType?: boolean
      intro?: string
    }
> = ({
  loading = false,
  showError = false,
  shortTitle = '',
  title = '',
  specialType,
  teaser = '',
  intro = '',
  teaserImage = '',
  linkProps,
  type,
  showContentType,
}) => {
  const contentTypeLabel = type && specialType ? getContentTypeLabel(type, specialType) : null

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { title: unusedTitle, ...linkPropsWithoutTitle } = linkProps || {}

  return (
    // Don't use the title attribute here, as we already use a heading that can be read by screen readers
    <StyledLink {...linkPropsWithoutTitle} linkType="blank">
      <StyledCard horizontal animateLoading={!showError} isLoading={loading} showError={showError}>
        <StyledCardContent>
          {showContentType && contentTypeLabel && (
            <div>
              <ContentType data-test="contentType">{contentTypeLabel}</ContentType>
            </div>
          )}
          <StyledHeading forwardedAs="h3">{shortTitle || title}</StyledHeading>
          <Paragraph dangerouslySetInnerHTML={{ __html: teaser || intro }} />
        </StyledCardContent>
        <StyledCardMedia>
          {/* Empty alt text necessary so screen-readers know this can be ignored, as it's already wrapped in a link with a heading */}
          {teaserImage && <Image alt="" src={getImageFromCms(teaserImage, 160, 160)} square />}
        </StyledCardMedia>
      </StyledCard>
    </StyledLink>
  )
}

export default EditorialBlockCard
