import styled, { css } from 'styled-components'
import { Card, CardContent, Heading, Paragraph, themeSpacing } from '@datapunt/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
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

const OrganizationCard = ({ loading, title, shortTitle, teaser, intro, linkProps }) => (
  <StyledCard isLoading={loading}>
    <StyledCardContent>
      <StyledHeading forwardedAs="h4" styleAs="h3">
        {shortTitle || title}
      </StyledHeading>
      <StyledParagraph dangerouslySetInnerHTML={{ __html: teaser || intro }} />

      <div>
        <OverviewLink linkProps={linkProps} label="Lees meer" />
      </div>
    </StyledCardContent>
  </StyledCard>
)

OrganizationCard.defaultProps = {
  loading: false,
  shortTitle: '',
  title: '',
  field_link: {},
  teaser: '',
  intro: '',
  to: {},
}

OrganizationCard.propTypes = {
  loading: PropTypes.bool,
  field_link: PropTypes.shape({}),
  title: PropTypes.string,
  shortTitle: PropTypes.string,
  teaser: PropTypes.string,
  intro: PropTypes.string,
  to: PropTypes.shape({}),
}

export default OrganizationCard
