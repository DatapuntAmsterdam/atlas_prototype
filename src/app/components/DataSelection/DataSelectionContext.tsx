import {
  createContext,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'
import useParam from '../../utils/useParam'
import {
  DataSelectionFilters,
  dataSelectionFiltersParam,
  polygonParam,
} from '../../pages/MapPage/query-params'
import { ActiveFilter, AvailableFilter } from './types'
import useLegacyDataselectionConfig from './useLegacyDataselectionConfig'

export interface DataSelectionContextProps {
  availableFilters: AvailableFilter[]
  addFilter: (filter: DataSelectionFilters) => void
  removeFilter: (key: string) => void
  totalResults: number
  activeFilters: ActiveFilter[]
  setTotalResults: Dispatch<SetStateAction<number>>
  setAvailableFilters: Dispatch<SetStateAction<any>>
}

const DataSelectionContext = createContext<DataSelectionContextProps | null>(null)

export default DataSelectionContext

const DataSelectionProvider: FunctionComponent = ({ children }) => {
  const [activeParamFilters, setActiveParamFilters] = useParam(dataSelectionFiltersParam)
  const [polygon] = useParam(polygonParam)
  const [availableFilters, setAvailableFilters] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const { currentDatasetConfig } = useLegacyDataselectionConfig()

  const addFilter = (filter: DataSelectionFilters) => {
    setActiveParamFilters({
      ...activeParamFilters,
      ...filter,
    })
  }
  const removeFilter = (key: string) => {
    // @ts-ignore
    const { [key]: omit, ...rest } = activeParamFilters
    setActiveParamFilters(Object.keys(rest).length ? rest : null)
  }

  const shape = useMemo(
    () =>
      polygon?.polygon?.length
        ? JSON.stringify(polygon.polygon.map(({ lat, lng }) => [lng, lat]))
        : null,
    [polygon],
  )

  const activeFilters = useMemo(() => {
    const filters =
      activeParamFilters && currentDatasetConfig
        ? Object.entries(activeParamFilters).reduce<ActiveFilter[]>((acc, [key, val]) => {
            const label = currentDatasetConfig.FILTERS.find(({ slug }) => slug === key)?.label
            if (label) {
              let value = val
              if (key === 'sbi_code') {
                value = val.replace(/['[\]]/g, '')
              }
              acc.push({ key, value, label: `${label}: ${value}` })
            }
            return acc
          }, [])
        : []

    if (shape) {
      filters.push({
        key: 'shape',
        value: shape,
        label: 'Ingetekende vorm op kaart',
      })
    }

    return filters
  }, [currentDatasetConfig, activeParamFilters, shape])

  return (
    <DataSelectionContext.Provider
      value={{
        // Only provide the token if the user does not have an authenticated session.
        availableFilters,
        activeFilters,
        addFilter,
        removeFilter,
        totalResults,
        setTotalResults,
        setAvailableFilters,
      }}
    >
      {children}
    </DataSelectionContext.Provider>
  )
}

export { DataSelectionProvider }

export function useDataSelection() {
  const context = useContext(DataSelectionContext)

  if (!context) {
    throw new Error(
      'No provider found for DataSelection, make sure you include DataSelectionProvider in your component hierarchy.',
    )
  }

  return context
}
