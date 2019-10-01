import styled, { css } from '@datapunt/asc-core'
import {
  breakpoint,
  Card,
  CardContent,
  CardMedia,
  Heading,
  Image,
  Link,
  Paragraph,
  styles,
  Tag,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'

const StyledLink = styled(Link)`
  border-bottom: ${themeColor('tint', 'level3')} 1px solid;
  width: 100%;
  min-height: 66px;

  &:hover {
    border-bottom: ${themeColor('secondary')} 1px solid;

    ${styles.HeadingStyle} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }
`

const StyledCard = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${themeSpacing(2)} 0;
  margin: ${themeSpacing(6)} 0;
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
const StyledTag = styled(Tag)`
  display: inline;
  margin-right: ${themeSpacing(1)};
`

const StyledHeading = styled(Heading)`
  margin-bottom: ${themeSpacing(2)};
`

const SpecialCard = ({
  loading,
  showError,
  shortTitle,
  title,
  specialType,
  teaser,
  intro,
  teaserImage,
  to,
  ...otherProps
}) => (
  <StyledLink to={to} $as={RouterLink} linkType="blank" {...otherProps}>
    <StyledCard horizontal animateLoading={!showError} loading={loading} showError={showError}>
      <StyledCardContent>
        <StyledHeading $as="h4" styleAs="h3">
          {shortTitle || title}
        </StyledHeading>
        <Paragraph>
          {specialType && (
            <StyledTag colorType="tint" colorSubtype="level3">
              {specialType}
            </StyledTag>
          )}
          {teaser || intro}
        </Paragraph>
      </StyledCardContent>
      <StyledCardMedia>
        <Image src={teaserImage} alt={shortTitle || title} square />
      </StyledCardMedia>
    </StyledCard>
  </StyledLink>
)

SpecialCard.defaultProps = {
  loading: false,
  showError: false,
}

SpecialCard.propTypes = {
  loading: PropTypes.bool,
  showError: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

export default SpecialCard
