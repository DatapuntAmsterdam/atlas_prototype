import { breakpoint, Label, Select, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { ChangeEvent, FunctionComponent } from 'react'
import styled from 'styled-components'
import useParam from '../../utils/useParam'
import { pageParam, SortOrder, sortParam } from './query-params'

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

export interface SearchSortProps {
  isOverviewPage: boolean
  disabled: boolean
}

const SearchSort: FunctionComponent<SearchSortProps> = ({ isOverviewPage, disabled }) => {
  const [, setPage] = useParam(pageParam)
  const [sort, setSort] = useParam(sortParam)
  const { trackEvent } = useMatomo()

  return (
    <SelectboxWrapper>
      <StyledLabel htmlFor="sort-select" label="Sorteren:" position="left">
        <StyledSelect
          id="sort-select"
          data-testid="sort-select"
          value={sort ? sortParam.encode(sort) : ''}
          disabled={disabled}
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            const sortRaw = event.target.value
            const newSort = sortRaw ? sortParam.decode(sortRaw) : null

            trackEvent({
              category: 'search',
              action: 'sort',
              name: sortRaw,
            })

            setSort(newSort)
            setPage(1, 'replace')
          }}
        >
          {!isOverviewPage && <option value="">Relevantie</option>}
          <option
            value={
              !isOverviewPage
                ? sortParam.encode({ field: 'date', order: SortOrder.Descending })
                : ''
            }
          >
            Publicatiedatum aflopend
          </option>
          <option value={sortParam.encode({ field: 'date', order: SortOrder.Ascending })}>
            Publicatiedatum oplopend
          </option>
          <option value={sortParam.encode({ field: 'title', order: SortOrder.Ascending })}>
            Titel A-Z
          </option>
          <option value={sortParam.encode({ field: 'title', order: SortOrder.Descending })}>
            Titel Z-A
          </option>
        </StyledSelect>
      </StyledLabel>
    </SelectboxWrapper>
  )
}

export default SearchSort
