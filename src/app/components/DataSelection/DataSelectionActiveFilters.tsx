import { FilterTag } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { useDataSelection } from './DataSelectionContext'
import useParam from '../../utils/useParam'
import { polygonParam } from '../../pages/MapPage/query-params'
import { DATASELECTION_REMOVE_FILTER } from '../../pages/MapPage/matomo-events'

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  list-style: none;
`

const DataSelectionActiveFilters = () => {
  const { removeFilter, activeFilters } = useDataSelection()
  const { trackEvent } = useMatomo()
  const [, setPolygon] = useParam(polygonParam)

  return activeFilters.length ? (
    <List data-testid="activeFilters">
      {activeFilters.map(({ key, label, value }) => (
        <li key={key}>
          <FilterTag
            type="button"
            aria-label={`Filter verwijderen: ${label}: ${value}`}
            onClick={() => {
              trackEvent(DATASELECTION_REMOVE_FILTER)
              if (key === 'shape') {
                setPolygon(null)
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
