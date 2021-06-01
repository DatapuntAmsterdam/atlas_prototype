import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { DatasetType } from './types'
import { routing } from '../../routes'
import DATA_SELECTION_CONFIG from '../../../shared/services/data-selection/data-selection-config'

const ROUTE_DATASET_MAPPER = {
  [routing.cadastralObjects.path]: DatasetType.Brk,
  [routing.establishments.path]: DatasetType.Hr,
  [routing.addresses.path]: DatasetType.Bag,
}

const useLegacyDataselectionConfig = () => {
  const location = useLocation()
  const pathname = useMemo(() => location.pathname.replace(/\/?(\?|#|$)/, '/$1'), [location])

  const currentDatasetType = ROUTE_DATASET_MAPPER[pathname] ?? null
  const currentDatasetConfig = currentDatasetType
    ? DATA_SELECTION_CONFIG.datasets[currentDatasetType]
    : null

  return { currentDatasetConfig, currentDatasetType, config: DATA_SELECTION_CONFIG.datasets }
}

export default useLegacyDataselectionConfig
