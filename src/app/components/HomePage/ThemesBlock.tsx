import { Column, Link, perceivedLoading, Row, Theme, themeSpacing } from '@datapunt/asc-ui'
import React, { useState } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { useQuery } from 'urql'
import PARAMETERS from '../../../store/parameters'
import { toSearch } from '../../../store/redux-first-router/actions'
import { Filter, FilterOption } from '../../models/filter'
import { ActiveFilter } from '../../pages/SearchPage/SearchPageDucks'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import BlockHeading from './BlockHeading'

const getFiltersQuery = `
  query {
    filters {
      type
      options {
        id
        label
      }
    }
  }
`

const StyledRow = styled(Row)`
  width: 100%;
  align-content: flex-start;
`

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(4)};
`

const StyledErrorMessage = styled(ErrorMessage)`
  margin: 0 auto;
`

const PlaceholderLink = styled(StyledLink)`
  color: transparent;
  ${perceivedLoading()}
`

const ContentHolder: React.FC = ({ children }) => (
  <StyledRow hasMargin={false}>
    <BlockHeading forwardedAs="h1">Zoek op thema</BlockHeading>
    {children}
  </StyledRow>
)

const PlaceholderContent: React.FC = () => {
  const [numChars] = useState(getRandomInRange(8, 16))

  return (
    <PlaceholderLink>
      <pre>{' '.repeat(numChars)}</pre>
    </PlaceholderLink>
  )
}

type PartialFilterOption = Pick<FilterOption, 'id' | 'label'>
type PartialFilter = Pick<Filter, 'type'> & { options: PartialFilterOption[] }

const THEME_TYPE = 'theme'
const PLACEHOLDER_RANGE = [...Array(12).keys()]

const ThemesBlock: React.FC = () => {
  const colSpan: Theme.TypeSpan = { small: 1, medium: 2, big: 3, large: 3, xLarge: 3 }
  const [{ fetching, error, data }, executeQuery] = useQuery<{ filters: PartialFilter[] }>({
    query: getFiltersQuery,
  })

  // Show placeholder content for the loading state.
  if (fetching) {
    return (
      <ContentHolder>
        {PLACEHOLDER_RANGE.map((index) => (
          <Column key={index} span={colSpan}>
            <PlaceholderContent key={index} />
          </Column>
        ))}
      </ContentHolder>
    )
  }

  const themeFilter = data?.filters?.find((filter) => filter.type === THEME_TYPE)

  // Show a message if an error occurred, or if no theme filter could be found.
  if (error || !themeFilter) {
    return (
      <ContentHolder>
        <Column span={12}>
          <StyledErrorMessage onClick={() => executeQuery()} />
        </Column>
      </ContentHolder>
    )
  }

  return (
    <ContentHolder>
      {themeFilter.options.map((option) => {
        const filters: ActiveFilter[] = [{ type: THEME_TYPE, values: [option.id] }]

        return (
          <Column key={option.id} span={colSpan}>
            <StyledLink
              forwardedAs={RouterLink}
              to={toSearch({ [PARAMETERS.FILTERS]: filters })}
              variant="with-chevron"
            >
              {option.label}
            </StyledLink>
          </Column>
        )
      })}
    </ContentHolder>
  )
}

export default ThemesBlock

function getRandomInRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}
