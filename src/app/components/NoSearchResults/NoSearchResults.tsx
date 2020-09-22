import { Heading, Link, List, Paragraph, themeSpacing, Typography } from '@amsterdam/asc-ui'
import React from 'react'
import RouterLink, { To } from 'redux-first-router-link'
import styled from 'styled-components'
import { formatNoResultsMessage } from './utils'

const StyledList = styled(List)`
  list-style: square;
  margin-bottom: ${themeSpacing(6)};
`

const StyledTypgraphy = styled(Typography)`
  margin-left: ${themeSpacing(5)};
  margin-bottom: 0;
`

const StyledListItem: React.FC = ({ children }) => (
  <StyledTypgraphy forwardedAs="li">{children}</StyledTypgraphy>
)

export interface NoSearchResultsProps {
  query: string
  label?: string
  to?: To
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({ query, label = '', to = false }) => (
  <>
    <Paragraph>{formatNoResultsMessage(query, label)}</Paragraph>
    <Heading as="h3">Zoeksuggesties</Heading>
    <StyledList>
      <StyledListItem>Maak de zoekcriteria eventueel minder specifiek.</StyledListItem>
      {to && (
        <StyledListItem>
          Of bekijk de lijst{' '}
          <Link as={RouterLink} to={to} title={label} variant="inline">
            {label}
          </Link>{' '}
          en filter vervolgens op thema.
        </StyledListItem>
      )}
    </StyledList>
  </>
)

export { StyledList, StyledListItem }

export default NoSearchResults
