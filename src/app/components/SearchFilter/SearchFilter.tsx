import React, { memo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import FilterBox from '../FilterBox'
import { setFilterValues, getFilterValues } from '../../pages/SearchPage/SearchPageDucks'
import { Filter, FilterType } from '../../models'
import CheckboxFilter from './filters/CheckboxFilter'
import RadioFilter from './filters/RadioFilter'
import SelectFilter from './filters/SelectFilter'

export interface SearchFilterProps {
  filter: Filter
  totalCount: number
  hideCount: boolean
}

function getFilterComponent(filterType: FilterType) {
  switch (filterType) {
    case FilterType.Checkbox:
      return CheckboxFilter
    case FilterType.Radio:
      return RadioFilter
    case FilterType.Select:
      return SelectFilter
    default:
      throw Error(
        `Unable to get filter component, no component for filter of type '${filterType}' could be found.`,
      )
  }
}

const SearchFilter: React.FC<SearchFilterProps> = ({ filter, totalCount, hideCount }) => {
  const { type, filterType, label, options } = filter
  const { trackEvent } = useMatomo()
  const dispatch = useDispatch()
  const selection = useSelector(getFilterValues(type))
  const FilterContent = getFilterComponent(filterType)

  function onSelectionChange(values: string[]) {
    const disabledFilters = selection.filter(value => !values.includes(value))
    const enabledFilters = values.filter(value => !selection.includes(value))

    disabledFilters.forEach(value =>
      trackEvent({ category: 'search', action: 'disable-filter', name: `${type}-${value}` }),
    )

    enabledFilters.forEach(value =>
      trackEvent({ category: 'search', action: 'enable-filter', name: `${type}-${value}` }),
    )

    dispatch(setFilterValues(type, values))
  }

  return (
    <FilterBox label={label}>
      <FilterContent
        type={type}
        options={options}
        totalCount={totalCount}
        hideCount={hideCount}
        selection={selection}
        onSelectionChange={values => onSelectionChange(values)}
      />
    </FilterBox>
  )
}

export default memo(SearchFilter)
