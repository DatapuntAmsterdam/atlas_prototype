import React from 'react'
import styled from '@datapunt/asc-core'
import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Heading,
  Paragraph,
  Image,
  Tag,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import RouterLink from 'redux-first-router-link'
import PAGES from '../../pages'

const notFoundImage = require('./not_found_thumbnail.jpg')

const CardHeading = styled(Heading)`
  border-bottom: 2px solid transparent;
  line-height: 22px;
  margin-bottom: ${themeSpacing(3)};
  width: fit-content;
`

const StyledRouterLink = styled(RouterLink)`
  margin-bottom: ${themeSpacing(4)};
  width: 100%;

  &:hover,
  &:focus {
    background-color: inherit;

    ${CardHeading} {
      color: ${themeColor('secondary')};
      border-color: ${themeColor('secondary')};
    }
  }
`

const StyledLinkWrapper = ({ children, ...otherProps }) => (
  <Link $as={StyledRouterLink} {...otherProps}>
    {children}
  </Link>
)

const StyledCard = styled(Card)`
  align-items: stretch;
`

const StyledCardHeading = styled(CardHeading)`
  display: inline-block;
`

const StyledCardMedia = styled(CardMedia)`
  flex: 1 0 auto;
  border: 1px solid ${themeColor('tint', 'level3')};
  height: 0%; // fix to reset the height given by the parent's display: flex;
  min-width: ${themeSpacing(12)};
  max-width: ${themeSpacing(40)};
  width: 20%;

  &::before {
    padding-top: ${({ vertical }) => (vertical ? '145%' : '100%')};
  }
`

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
  padding: 0;
  margin: ${themeSpacing(0, 4)};
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  position: relative;
`

const StyledTag = styled(Tag)`
  display: inline-block;
  text-transform: capitalize;
  margin-bottom: ${themeSpacing(2)};
  padding: 2px; // needs to check if we need to implement this in asc-ui, as we also use the same padding on the homepage
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
  text-transform: capitalize;
  margin-top: auto;
`

const EditorialCard = ({
  id,
  title,
  shortTitle,
  teaser,
  intro,
  specialType,
  localeDate,
  localeDateFormatted,
  teaserImage,
  coverImage,
  currentPage,
  imageIsVertical,
  to,
}) => (
  <StyledLinkWrapper key={id} to={to} linkType="blank">
    <StyledCard horizontal>
      <StyledCardMedia vertical={imageIsVertical}>
        <Image
          src={(currentPage === PAGES.PUBLICATIONS ? coverImage : teaserImage) || notFoundImage}
          alt={title}
          square
        />
      </StyledCardMedia>
      <StyledCardContent>
        <div>
          <StyledCardHeading $as="h4">{shortTitle || title}</StyledCardHeading>
        </div>

        {specialType && (
          <div>
            <StyledTag colorType="tint" colorSubtype="level3">
              {specialType}
            </StyledTag>
          </div>
        )}

        <div>
          <IntroText>{teaser || intro}</IntroText>
        </div>

        {localeDate && (
          <div>
            <MetaText as="time" datetime={localeDate}>
              {localeDateFormatted}
            </MetaText>
          </div>
        )}
      </StyledCardContent>
    </StyledCard>
  </StyledLinkWrapper>
)

export default EditorialCard
