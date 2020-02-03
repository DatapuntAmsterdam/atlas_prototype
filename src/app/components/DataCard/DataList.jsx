import styled from '@datapunt/asc-core'
import { Icon, Link, themeSpacing, breakpoint } from '@datapunt/asc-ui'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import { toDataSearch, toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import { DEFAULT_LIMIT, DATA_FILTERS } from '../../pages/SearchPage/config'
import SearchLink from '../Links/SearchLink/SearchLink'
import SearchHeading from '../SearchHeading/SearchHeading'
import DataIcon from './DataIcon'
import PARAMETERS from '../../../store/parameters'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import ErrorMessage from '../HomePage/ErrorMessage'
import { DEFAULT_LOCALE } from '../../../shared/config/locale.config'

const List = styled.ul`
  margin-bottom: ${({ showLoadMore }) => !showLoadMore && themeSpacing(6)};
`

const StyledLink = styled(Link)`
  margin: ${themeSpacing(2, 0)};

  :last-child {
    margin-bottom: 0;
  }
`

const StyledIcon = styled(Icon)`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${themeSpacing(1)};

  & svg {
    width: 40px;
    height: 40px;
  }
`
const StyledErrorMessage = styled(ErrorMessage)`
  @media screen and ${breakpoint('min-width', 'mobileL')} {
    width: 50%;
  }
`

const showSubtype = (type, subtype) =>
  type === 'ligplaats' ||
  type === 'standplaats' ||
  (type === 'openbare_ruimte' && subtype !== 'weg') ||
  (type === 'adres' && subtype !== 'verblijfsobject') ||
  type === 'gebied' ||
  type === 'explosief' ||
  (type === 'monument' && subtype === 'complex')

const DataList = ({ type, label, count, results, showLoadMore }) => (
  <div>
    <SearchHeading
      label={`${label} (${count.toLocaleString(DEFAULT_LOCALE)})`}
      icon={
        <StyledIcon>
          <DataIcon type={type} />
        </StyledIcon>
      }
    />

    {results ? (
      <List showLoadMore={showLoadMore}>
        {results.map(location => (
          <li key={location.id}>
            <StyledLink
              to={toDetailFromEndpoint(location.endpoint, VIEW_MODE.SPLIT)}
              $as={RouterLink}
              variant="with-chevron"
            >
              {location.label}
              {showSubtype(location.type, location.subtype) ? ` (${location.subtype})` : ''}
            </StyledLink>
          </li>
        ))}
      </List>
    ) : (
      <StyledErrorMessage />
    )}
    {!showLoadMore && count > DEFAULT_LIMIT && (
      <SearchLink
        to={toDataSearch(
          {
            [PARAMETERS.FILTERS]: [
              {
                type: DATA_FILTERS,
                values: [type],
              },
            ],
          },
          false,
          true,
        )}
        label={`Alle ${label && label.toLowerCase()} tonen`}
      />
    )}
  </div>
)

export default DataList
