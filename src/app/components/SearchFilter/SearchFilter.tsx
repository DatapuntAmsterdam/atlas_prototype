import { useMatomo } from '@datapunt/matomo-tracker-react'
import { FunctionComponent, useMemo } from 'react'
import { Filter, FilterType } from '../../models/filter'
import { ActiveFilter, activeFiltersParam, pageParam } from '../../pages/SearchPage/query-params'
import useParam from '../../utils/useParam'
import FilterBox from '../FilterBox'
import CheckboxFilter from './filters/CheckboxFilter'
import RadioFilter from './filters/RadioFilter'
import SelectFilter from './filters/SelectFilter'

export interface SearchFilterProps {
  filter: Filter
  totalCount: number
  hideCount: boolean
}

export function getFilterComponent(filterType: FilterType) {
  switch (filterType) {
    case FilterType.Checkbox:
      return CheckboxFilter
    case FilterType.Radio:
      return RadioFilter
    case FilterType.Select:
      return SelectFilter
    default:
      throw Error(
        `Unable to get filter component, no component for filter of type '${
          filterType as string
        }' could be found.`,
      )
  }
}

function updateFilterValues(
  activeFilters: ActiveFilter[],
  type: string,
  values: string[],
): ActiveFilter[] {
  const updatedFilters = activeFilters
    // Remove the filter that matches by type.
    .filter((filter) => filter.type !== type)

  // Restore the filter if it has values present.
  if (values.length > 0) {
    updatedFilters.push({ type, values })
  }

  // Sort the filters so the URL will remain consistent.
  return updatedFilters
    .sort((a, b) => (a.type > b.type ? 1 : -1))
    .map((filter) => ({ ...filter, values: filter.values.sort() }))
}

const SearchFilter: FunctionComponent<SearchFilterProps> = ({ filter, totalCount, hideCount }) => {
  const { trackEvent } = useMatomo()
  const [activeFilters, setActiveFilters] = useParam(activeFiltersParam)
  const [, setPage] = useParam(pageParam)
  const selection = useMemo(() => getFilterValues(filter.type), [filter.type])
  const FilterContent = getFilterComponent(filter.filterType)

  function getFilterValues(type: string) {
    return activeFilters.find((activeFilter) => activeFilter.type === type)?.values ?? []
  }

  function setFilterValues(type: string, values: string[]) {
    setActiveFilters(updateFilterValues(activeFilters, type, values))
  }

  function onSelectionChange(values: string[]) {
    const disabledFilters = selection.filter((value) => !values.includes(value))
    const enabledFilters = values.filter((value) => !selection.includes(value))

    disabledFilters.forEach((value) =>
      trackEvent({ category: 'search', action: 'disable-filter', name: `${filter.type}-${value}` }),
    )

    enabledFilters.forEach((value) =>
      trackEvent({ category: 'search', action: 'enable-filter', name: `${filter.type}-${value}` }),
    )

    setFilterValues(filter.type, values)
    setPage(1, 'replace')
  }

  return (
    <FilterBox label={filter.label}>
      <FilterContent
        type={filter.type}
        label={filter.label}
        options={filter.options}
        totalCount={totalCount}
        hideCount={hideCount}
        selection={selection}
        onSelectionChange={(values) => onSelectionChange(values)}
      />
    </FilterBox>
  )
}

export default SearchFilter
