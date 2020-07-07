import { breakpoint, Link, themeSpacing } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import styled from 'styled-components'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import { toDataSearchType, toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import formatCount from '../../utils/formatCount'
import ErrorMessage from '../ErrorMessage/ErrorMessage'
import SearchLink from '../Links/SearchLink/SearchLink'
import SearchHeading from '../SearchHeading/SearchHeading'
import DataIcon from './DataIcon'

const List = styled.ul`
  margin-bottom: ${({ hasMarginBottom }) => hasMarginBottom && themeSpacing(6)};
`

const StyledLink = styled(Link)`
  margin: ${themeSpacing(2, 0)};

  :last-child {
    margin-bottom: 0;
  }
`

const StyledErrorMessage = styled(ErrorMessage)`
  @media screen and ${breakpoint('min-width', 'mobileL')} {
    width: 50%;
  }
`

const DataList = ({ type, label, count, results, withPagination }) => (
  <div>
    <SearchHeading label={`${label} (${formatCount(count)})`} icon={<DataIcon type={type} />} />

    {results ? (
      <List hasMarginBottom={!withPagination}>
        {results.map((location) => (
          <li key={location.id}>
            <StyledLink
              to={toDetailFromEndpoint(location.endpoint, VIEW_MODE.SPLIT)}
              forwardedAs={RouterLink}
              variant="with-chevron"
            >
              {location.label}
            </StyledLink>
          </li>
        ))}
      </List>
    ) : (
      <StyledErrorMessage
        message="Er is een fout opgetreden bij het laden van dit blok."
        buttonLabel="Probeer opnieuw"
        buttonOnClick={() => window.location.reload()}
      />
    )}
    {!withPagination && results && count > results.length && (
      <SearchLink
        to={toDataSearchType(type)}
        label={`Alle ${label && label.toLowerCase()} tonen`}
      />
    )}
  </div>
)

export default DataList
