import { FunctionComponent } from 'react'
import { FilterTag } from '@amsterdam/asc-ui'
import styled from 'styled-components'

// TODO: Replace this interface with one that is shared with other components.
interface Filter {
  slug: string
  label: string
  option: string
}

export interface ActiveFiltersProps {
  removeFilter: (slug: string) => void
  filters: Filter[]
}

const StyledUl = styled.ul`
  display: flex;
  list-style: none;
`

const ActiveFilters: FunctionComponent<ActiveFiltersProps> = ({ removeFilter, filters }) =>
  filters && filters.length ? (
    <StyledUl data-testid="activeFilters">
      {filters.map(({ slug, label, option }) => (
        <li key={slug}>
          <FilterTag
            type="button"
            aria-label={`Filter verwijderen: ${label}: ${option}`}
            onClick={() => removeFilter(slug)}
            data-testid="activeFiltersItem"
          >
            {label}: {option}
          </FilterTag>
        </li>
      ))}
    </StyledUl>
  ) : null

export default ActiveFilters
