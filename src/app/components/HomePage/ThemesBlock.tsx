import { Link, outlineWhenFocused, perceivedLoading, themeSpacing } from '@datapunt/asc-ui'
import React, { useState } from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { useQuery } from 'urql'
import PARAMETERS from '../../../store/parameters'
import { toSearch } from '../../../store/redux-first-router/actions'
import { Filter, FilterOption } from '../../models/filter'
import { ActiveFilter } from '../../pages/SearchPage/SearchPageDucks'
import useUniqueId from '../../utils/useUniqueId'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import BlockHeading from './BlockHeading'

// TODO: Generate types for this GQL query.
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

const StyledLink = styled(Link)`
  margin-bottom: ${themeSpacing(4)};
`

const StyledErrorMessage = styled(ErrorMessage)`
  margin: 0 auto;
`

const PlaceholderLink = styled.div`
  color: transparent;
  height: 36px; // link height + 16px margin bottom
  pre {
    width: 90%;
    height: 20px; // link height
    ${perceivedLoading()}
  }
`

const StyledUl = styled.ul`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
`

const ContentHolderStyle = styled.nav`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${outlineWhenFocused()}
`

const ContentHolder: React.FC = ({ children }) => {
  const headingId = useUniqueId('themes-heading')

  return (
    <ContentHolderStyle tabIndex={0} aria-describedby={headingId}>
      {/*
      // @ts-ignore */}
      <BlockHeading id={headingId} forwardedAs="h2" styleAs="h1">
        Zoek op thema
      </BlockHeading>
      {children}
    </ContentHolderStyle>
  )
}

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
  const [{ fetching, error, data }, executeQuery] = useQuery<{ filters: PartialFilter[] }>({
    query: getFiltersQuery,
  })

  // Show placeholder content for the loading state.
  if (fetching) {
    return (
      <ContentHolder>
        <StyledUl>
          {PLACEHOLDER_RANGE.map((index) => (
            <li key={index}>
              <PlaceholderContent />
            </li>
          ))}
        </StyledUl>
      </ContentHolder>
    )
  }

  const themeFilter = data?.filters?.find((filter) => filter.type === THEME_TYPE)

  // Show a message if an error occurred, or if no theme filter could be found.
  if (error || !themeFilter) {
    return (
      <ContentHolder>
        <StyledErrorMessage
          message="Er is een fout opgetreden bij het laden van dit blok."
          buttonLabel="Probeer opnieuw"
          buttonOnClick={executeQuery}
        />
      </ContentHolder>
    )
  }

  return (
    <ContentHolder>
      <StyledUl>
        {themeFilter.options.map((option) => {
          const filters: ActiveFilter[] = [{ type: THEME_TYPE, values: [option.id] }]

          return (
            <li key={option.label}>
              <StyledLink
                forwardedAs={RouterLink}
                variant="with-chevron"
                {...({ to: toSearch({ [PARAMETERS.FILTERS]: filters }) } as any)}
              >
                {option.label}
              </StyledLink>
            </li>
          )
        })}
      </StyledUl>
    </ContentHolder>
  )
}

export default ThemesBlock

function getRandomInRange(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}
