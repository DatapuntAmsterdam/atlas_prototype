import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { FunctionComponent } from 'react'
import { useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import type { Filter } from '../../models/filter'
import { FilterType } from '../../models/filter'
import FilterBox from '../FilterBox'
import CheckboxFilter from './filters/CheckboxFilter'
import RadioFilter from './filters/RadioFilter'
import SelectFilter from './filters/SelectFilter'
import useParam from '../../utils/useParam'
import { activeFiltersParam, pageParam } from '../../pages/SearchPage/query-params'
import useBuildQueryString from '../../utils/useBuildQueryString'

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
  const history = useHistory()
  const location = useLocation()
  const { buildQueryString } = useBuildQueryString()
  const [filterValues] = useParam(activeFiltersParam)
  const selection = filterValues.find(({ type: filterTypes }) => filterTypes === type)?.values ?? []
  const FilterContent = getFilterComponent(filterType)

  const onSelectionChange = useCallback(
    (values: string[]) => {
      const disabledFilters = selection?.filter((value) => !values.includes(value))
      const enabledFilters = values.filter((value) => !selection?.includes(value))

      disabledFilters?.forEach((value) =>
        trackEvent({ category: 'search', action: 'disable-filter', name: `${type}-${value}` }),
      )

      enabledFilters.forEach((value) =>
        trackEvent({ category: 'search', action: 'enable-filter', name: `${type}-${value}` }),
      )

      history.replace({
        pathname: location.pathname,
        search: buildQueryString([
          [
            // @ts-ignore
            activeFiltersParam,
            values.length
              ? [
                  {
                    type,
                    values,
                  },
                ]
              : [],
          ],
          // @ts-ignore
          [pageParam, 1],
        ]),
      })
    },
    [location, selection, trackEvent, type, buildQueryString],
  )

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

export default SearchFilter
