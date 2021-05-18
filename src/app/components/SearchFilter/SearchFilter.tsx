import { useMatomo } from '@datapunt/matomo-tracker-react'
import { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { FunctionComponent } from 'react'
import type { Filter } from '../../models/filter'
import { FilterType } from '../../models/filter'
import { getFilterValues, setFilterValues, setPage } from '../../pages/SearchPage/SearchPageDucks'
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

const SearchFilter: FunctionComponent<SearchFilterProps> = ({ filter, totalCount, hideCount }) => {
  const { type, filterType, label, options } = filter
  const { trackEvent } = useMatomo()
  const dispatch = useDispatch()
  const selection = useSelector(getFilterValues(type))
  const FilterContent = getFilterComponent(filterType)

  function onSelectionChange(values: string[]) {
    const disabledFilters = selection.filter((value) => !values.includes(value))
    const enabledFilters = values.filter((value) => !selection.includes(value))

    disabledFilters.forEach((value) =>
      trackEvent({ category: 'search', action: 'disable-filter', name: `${type}-${value}` }),
    )

    enabledFilters.forEach((value) =>
      trackEvent({ category: 'search', action: 'enable-filter', name: `${type}-${value}` }),
    )

    dispatch(setPage(1))
    dispatch(setFilterValues(type, values))
  }

  return (
    <FilterBox label={label}>
      <FilterContent
        type={type}
        label={label}
        options={options}
        totalCount={totalCount}
        hideCount={hideCount}
        selection={selection}
        onSelectionChange={(values) => onSelectionChange(values)}
      />
    </FilterBox>
  )
}

export default memo(SearchFilter)
