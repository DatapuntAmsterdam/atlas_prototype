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
  breakpoint,
  themeColor,
} from '@datapunt/asc-ui'

const notFoundImage = require('./not_found_thumbnail.jpg')

const CardHeading = styled(Heading)`
  border-bottom: 2px solid transparent;
  line-height: 22px;
  margin-bottom: 12px;
  width: fit-content;
`

const StyledLink = styled(Link)`
  margin-bottom: 16px;
  width: 100%;

  &:hover,
  &:focus {
    ${CardHeading} {
      color: ${themeColor('secondary')};
      border-color: ${themeColor('secondary')};
    }
  }
`

const StyledCard = styled(Card)`
  align-items: stretch;
`

const StyledCardHeading = styled(CardHeading)`
  display: inline-block;
`

const StyledCardMedia = styled(CardMedia)`
  width: 20%;
  max-width: 160px;
  max-height: 160px;
  flex: 1 0 auto;

  @media screen and ${breakpoint('max-width', 'laptopM')} {
    height: 160px;
    flex: 1 0 160px;
  }

  @media screen and ${breakpoint('max-width', 'tabletM')} {
    height: 72px;
    flex: 1 0 72px;
  }

  @media screen and ${breakpoint('max-width', 'mobileM')} {
    height: 56px;
    flex: 1 0 56px;
  }
`

const StyledCardContent = styled(CardContent)`
  padding: 0;
  margin: 0 16px;
  border-bottom: 1px solid ${themeColor('tint', 'level3')};
  position: relative;
`

const StyledTag = styled(Tag)`
  display: inline-block;
  text-transform: capitalize;
`

const IntroText = styled(Paragraph)`
  padding-bottom: 16px;
`

const MetaText = styled(Paragraph)`
  color: grey;
  padding-bottom: 16px;
  font-size: 14px;
  line-height: 1.25;
  text-transform: capitalize;
`

const EditorialCard = ({
  id,
  title,
  teaserImageUrl,
  shortTitle,
  teaser,
  intro,
  specialType,
  localeDate,
  href,
}) => (
  <StyledLink key={id} href={href} linkType="blank">
    <StyledCard horizontal>
      <StyledCardMedia>
        <Image src={teaserImageUrl || notFoundImage} alt={title} square />
      </StyledCardMedia>
      <StyledCardContent>
        <StyledCardHeading $as="h4">{shortTitle || title}</StyledCardHeading>
        <IntroText>{teaser || intro}</IntroText>
        {specialType ? <StyledTag>{specialType}</StyledTag> : <MetaText>{localeDate}</MetaText>}
      </StyledCardContent>
    </StyledCard>
  </StyledLink>
)

export default EditorialCard
