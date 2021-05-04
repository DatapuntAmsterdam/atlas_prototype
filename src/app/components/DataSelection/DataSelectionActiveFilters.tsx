import { useDispatch } from 'react-redux'
import { FilterTag } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { removeGeometryFilter } from '../../../shared/ducks/data-selection/actions'
import { useDataSelection } from './DataSelectionContext'
import useParam from '../../utils/useParam'
import { polygonParam } from '../../pages/MapPage/query-params'

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
`

const DataSelectionActiveFilters = () => {
  const dispatch = useDispatch()
  const { removeFilter, activeFilters } = useDataSelection()
  const [, setPolygon] = useParam(polygonParam)
  return activeFilters.length ? (
    <List data-testid="activeFilters">
      {activeFilters.map(({ key, label, value }) => (
        <li key={key}>
          <FilterTag
            type="button"
            aria-label={`Filter verwijderen: ${label}: ${value}`}
            onClick={() => {
              if (key === 'shape') {
                setPolygon(null)
                dispatch(removeGeometryFilter())
              } else {
                removeFilter(key)
              }
            }}
            data-testid="activeFiltersItem"
          >
            {label}
          </FilterTag>
        </li>
      ))}
    </List>
  ) : null
}

export default DataSelectionActiveFilters
