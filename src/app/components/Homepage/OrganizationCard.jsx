import styled, { css } from '@datapunt/asc-core'
import { Card, CardContent, Heading, Link, Paragraph, themeSpacing } from '@datapunt/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import OverviewLink from './OverviewLink'

const StyledCard = styled(Card)`
  border-top: 2px solid;
  align-items: flex-start;
  height: 100%;
  width: 100%;

  // Override the margin-bottom of the Card component when used in a CardContainer
  && {
    margin-bottom: 0px;
  }

  ${({ loading }) =>
    !loading &&
    css`
      background-color: inherit;
    `}
`

const StyledCardContent = styled(CardContent)`
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const StyledHeading = styled(Heading)`
  margin: ${themeSpacing(3, 0, 6)};
`

const StyledParagraph = styled(Paragraph)`
  height: 100%;

  // Override the margin-bottom of the Paragraph component
  && {
    margin-bottom: ${themeSpacing(6)};
  }
`

const OrganizationCard = ({
  loading,
  title,
  shortTitle,
  teaser,
  intro,
  to,
  field_link: link,
  ...otherProps
}) => (
  <StyledCard $as={RouterLink} loading={loading} {...otherProps}>
    <StyledCardContent>
      <StyledHeading $as="h4" styleAs="h3">
        {shortTitle || title}
      </StyledHeading>
      <StyledParagraph>{teaser || intro}</StyledParagraph>

      <OverviewLink
        $as={link && link.uri ? Link : RouterLink}
        to={to}
        href={link && link.uri}
        label="Lees meer"
      />
    </StyledCardContent>
  </StyledCard>
)

OrganizationCard.defaultProps = {
  loading: false,
  showError: false,
}

OrganizationCard.propTypes = {
  loading: PropTypes.bool,
  showError: PropTypes.bool,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
}

export default OrganizationCard
