import {
  Card,
  CardContent,
  Heading,
  Link,
  Paragraph,
  styles,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'styled-components'

const StyledCard = styled(Card)`
  width: 100%;
  height: 100%;
  pointer-events: none; /* FF 60 fix */
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
    background: none;
    position: relative;
  }
`

const AboutCard = ({ loading, shortTitle, title, teaser, intro, linkProps }) => (
  <StyledLink {...linkProps} variant="blank">
    <StyledCard backgroundColor="level2" shadow isLoading={loading}>
      <StyledCardContent>
        <Heading as="h3">{shortTitle || title}</Heading>
        <Paragraph dangerouslySetInnerHTML={{ __html: teaser || intro }} />
      </StyledCardContent>
    </StyledCard>
  </StyledLink>
)

AboutCard.defaultProps = {
  loading: false,
  shortTitle: '',
  title: '',
  teaser: '',
  intro: '',
  to: null,
}

AboutCard.propTypes = {
  loading: PropTypes.bool,
  title: PropTypes.string,
  shortTitle: PropTypes.string,
  teaser: PropTypes.string,
  intro: PropTypes.string,
  to: PropTypes.shape({}),
}

export default AboutCard
