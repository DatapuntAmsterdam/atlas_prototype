import { useDispatch, useSelector } from 'react-redux'
import { removeGeometryFilter } from '../../shared/ducks/data-selection/actions'
import {
  removeFilter as removeActiveFilter,
  selectDataSelectionFilters,
} from '../../shared/ducks/filters/filters'
import ActiveFilters from '../components/ActiveFilters/ActiveFilters'

const DataSelectionActiveFilters = () => {
  const dispatch = useDispatch()
  const filters = useSelector(selectDataSelectionFilters)
  return (
    <ActiveFilters
      filters={filters}
      removeFilter={(key) => {
        dispatch(key === 'shape' ? removeGeometryFilter() : removeActiveFilter(key))
      }}
    />
  )
}

export default DataSelectionActiveFilters
