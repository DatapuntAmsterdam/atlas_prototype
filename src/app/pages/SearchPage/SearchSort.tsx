import { breakpoint, Label, Select, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import useBuildQueryString from '../../utils/useBuildQueryString'
import { pageParam, Sort, sortParam } from './query-params'

const SelectboxWrapper = styled.div`
  display: flex;
  margin-bottom: ${themeSpacing(4)};
  align-self: flex-start;

  @media screen and ${breakpoint('min-width', 'mobileL')} {
    margin-left: ${themeSpacing(4)};
  }
  @media screen and ${breakpoint('max-width', 'tabletS')} {
    flex-grow: 1;
    max-width: 400px;
  }
  @media screen and ${breakpoint('min-width', 'laptop')} {
    margin-left: auto;
  }
`

const StyledSelect = styled(Select)`
  padding-right: ${themeSpacing(8)};
`

const StyledLabel = styled(Label)`
  color: ${themeColor('tint', 'level6')};
  width: 100%;
  span {
    flex-shrink: 0;
    margin-right: ${themeSpacing(4)};
  }
`

interface SearchSortProps {
  sort: Sort | null
  disabled: boolean
  isOverviewPage: boolean
}

const SearchSort: FunctionComponent<SearchSortProps> = ({ sort, isOverviewPage, disabled }) => {
  const { trackEvent } = useMatomo()
  const history = useHistory()
  const location = useLocation()
  const { buildQueryString } = useBuildQueryString()

  return (
    <SelectboxWrapper>
      <StyledLabel htmlFor="sort-select" label="Sorteren:" position="left">
        <StyledSelect
          id="sort-select"
          data-testid="sort-select"
          value={sort ? `${sort.field}:${sort.order}` : undefined}
          disabled={disabled}
          onChange={(e) => {
            // @ts-ignore
            const [field, order] = e.target.value.split(':')
            trackEvent({
              category: 'search',
              action: 'sort',
              // @ts-ignore
              name: e.target.value,
            })
            history.replace({
              pathname: location.pathname,
              search: buildQueryString([
                // @ts-ignore
                [pageParam, 1],
                // @ts-ignore
                [sortParam, { field, order }],
              ]),
            })
          }}
        >
          {!isOverviewPage && <option value="">Relevantie</option>}
          <option value={!isOverviewPage ? 'date:desc' : ''}>Publicatiedatum aflopend</option>
          <option value="date:asc">Publicatiedatum oplopend</option>
          <option value="title:asc">Titel A-Z</option>
          <option value="title:desc">Titel Z-A</option>
        </StyledSelect>
      </StyledLabel>
    </SelectboxWrapper>
  )
}

export default SearchSort
