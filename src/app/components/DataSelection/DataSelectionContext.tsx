import { useMemo, useState } from 'react'
import type { Dispatch, FunctionComponent, SetStateAction } from 'react'
import type { DataSelectionFilters } from '../../pages/MapPage/query-params'
import { dataSelectionFiltersParam, polygonParam } from '../../pages/MapPage/query-params'
import createNamedContext from '../../utils/createNamedContext'
import useParam from '../../utils/useParam'
import useRequiredContext from '../../utils/useRequiredContext'
import type { ActiveFilter, AvailableFilter } from './types'
import useLegacyDataselectionConfig from './useLegacyDataselectionConfig'

type Action<T extends keyof DataSelectionContextProps> = Dispatch<
  SetStateAction<DataSelectionContextProps[T]>
>

export interface DataSelectionContextProps {
  availableFilters: AvailableFilter[]
  addFilter: (filter: DataSelectionFilters) => void
  removeFilter: (key: string) => void
  totalResults: number
  activeFilters: ActiveFilter[]
  setTotalResults: Action<'totalResults'>
  setAvailableFilters: Action<'availableFilters'>
  distanceText?: string
  drawToolLocked: boolean
  setDrawToolLocked: Action<'drawToolLocked'>
  setDistanceText: Action<'distanceText'>
}

const DataSelectionContext = createNamedContext<DataSelectionContextProps | null>(
  'DataSelection',
  null,
)

const DataSelectionProvider: FunctionComponent = ({ children }) => {
  const [activeParamFilters, setActiveParamFilters] = useParam(dataSelectionFiltersParam)
  const [polygon] = useParam(polygonParam)
  const [distanceText, setDistanceText] = useState<string>()
  const [drawToolLocked, setDrawToolLocked] = useState(false)
  const [availableFilters, setAvailableFilters] = useState<
    DataSelectionContextProps['availableFilters']
  >([])
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
        distanceText,
        setDistanceText,
        drawToolLocked,
        setDrawToolLocked,
      }}
    >
      {children}
    </DataSelectionContext.Provider>
  )
}

export { DataSelectionProvider }

export function useDataSelection() {
  return useRequiredContext(DataSelectionContext)
}
