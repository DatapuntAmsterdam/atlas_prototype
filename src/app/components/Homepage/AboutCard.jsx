import styled from '@datapunt/asc-core'
import {
  Card,
  CardContent,
  Heading,
  Link,
  Paragraph,
  styles,
  themeColor,
  themeSpacing,
} from '@datapunt/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;
  cursor: pointer;
`

const StyledCardContent = styled(CardContent)`
  padding: ${themeSpacing(5, 4)};
`

const StyledLink = styled(Link)`
  width: 100%;
  height: 100%;

  &:hover {
    ${StyledCard} {
      box-shadow: 2px 2px ${themeColor('secondary')};
    }

    ${styles.HeadingStyle} {
      color: ${themeColor('secondary')};
      text-decoration: underline;
    }
  }

  &:focus {
    ${styles.CardStyle} {
      background: none;
    }
  }
`

const AboutCard = ({ loading, shortTitle, title, teaser, intro, showError, ...otherProps }) => (
  <StyledLink $as={RouterLink} linkType="blank" {...otherProps}>
    <StyledCard backgroundColor="level2" shadow loading={loading}>
      <StyledCardContent>
        <Heading $as="h4" styleAs="h3">
          {shortTitle || title}
        </Heading>
        <Paragraph>{teaser || intro}</Paragraph>
      </StyledCardContent>
    </StyledCard>
  </StyledLink>
)

AboutCard.defaultProps = {
  loading: false,
  teaser: '',
  intro: '',
}

AboutCard.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string.isRequired,
  teaser: PropTypes.string,
  intro: PropTypes.string,
  href: PropTypes.string.isRequired,
}

export default AboutCard
