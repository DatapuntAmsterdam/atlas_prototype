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
import PropTypes from 'prop-types'
import React from 'react'
import getImageFromCms from '../../utils/getImageFromCms'
import focusOutline from '../shared/focusOutline'
import getContentTypeLabel from '../../utils/getContentTypeLabel'

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

    ${focusOutline()}
  }
`

const StyledCard = styled(Card)`
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
  color: ${themeColor('support', 'valid')};
  font-size: 12px;
  font-weight: bold;
  line-height: 16px;
`

const EditorialBlockCard = ({
  loading,
  showError,
  shortTitle,
  title,
  specialType,
  type,
  teaser,
  intro,
  teaserImage,
  linkProps,
  showContentType,
}) => {
  const contentTypeLabel = type ? getContentTypeLabel(type, specialType) : null

  return (
    <StyledLink {...linkProps} linkType="blank">
      <StyledCard horizontal animateLoading={!showError} isLoading={loading} showError={showError}>
        <StyledCardContent>
          {showContentType && contentTypeLabel && (
            <div>
              <ContentType data-test="contentType">{contentTypeLabel}</ContentType>
            </div>
          )}
          <StyledHeading forwardedAs="h4" styleAs="h3">
            {shortTitle || title}
          </StyledHeading>
          <Paragraph dangerouslySetInnerHTML={{ __html: teaser || intro }} />
        </StyledCardContent>
        <StyledCardMedia>
          {teaserImage && (
            <Image src={getImageFromCms(teaserImage, 160, 160)} alt={shortTitle || title} square />
          )}
        </StyledCardMedia>
      </StyledCard>
    </StyledLink>
  )
}

EditorialBlockCard.defaultProps = {
  loading: false,
  showError: false,
  shortTitle: '',
  title: '',
  specialType: '',
  teaser: '',
  intro: '',
  teaserImage: '',
  to: {},
}

EditorialBlockCard.propTypes = {
  loading: PropTypes.bool,
  showError: PropTypes.bool,
  specialType: PropTypes.string,
  title: PropTypes.string,
  shortTitle: PropTypes.string,
  teaser: PropTypes.string,
  intro: PropTypes.string,
  teaserImage: PropTypes.string,
  to: PropTypes.shape({}),
}

export default EditorialBlockCard
