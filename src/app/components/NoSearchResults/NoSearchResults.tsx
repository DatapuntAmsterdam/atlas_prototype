import { Heading, Link, List, Paragraph, themeSpacing, Typography } from '@amsterdam/asc-ui'
import { LocationDescriptorObject } from 'history'
import { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
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

const StyledListItem: FunctionComponent = ({ children }) => (
  <StyledTypgraphy forwardedAs="li">{children}</StyledTypgraphy>
)

export interface NoSearchResultsProps {
  query: string
  label?: string
  to?: LocationDescriptorObject
}

const NoSearchResults: FunctionComponent<NoSearchResultsProps> = ({ query, label = '', to }) => (
  <>
    <Paragraph data-testid="noSearchResults">{formatNoResultsMessage(query, label)}</Paragraph>
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
