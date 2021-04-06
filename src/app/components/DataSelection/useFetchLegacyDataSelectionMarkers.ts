import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { polygonParam, ViewMode, viewParam } from '../../pages/MapPage/query-params'
import useParam from '../../utils/useParam'
import { useDataSelection } from './DataSelectionContext'
import useLegacyDataselectionConfig from './useLegacyDataselectionConfig'
import {
  fetchMarkersRequest,
  fetchMarkersSuccess,
} from '../../../shared/ducks/data-selection/actions'
import { createFiltersObject } from '../../../shared/services/data-selection/normalizations'
import BOUNDING_BOX from '../../../map/services/bounding-box.constant'
import { getMapBoundingBox, getMapZoom } from '../../../map/ducks/map/selectors'

/**
 * Note: a lot of this logic has been refactored from several sagas and put into this one
 * hook. There is legacy code mixed with modern stuff, so we do need to get rid of this
 * hook ASAP.
 */
const useFetchLegacyDataSelectionMarkers = () => {
  const [view] = useParam(viewParam)
  const [polygon] = useParam(polygonParam)
  const mapZoom = useSelector(getMapZoom)
  const mapBoundingBox = useSelector(getMapBoundingBox)
  const dispatch = useDispatch()
  const { activeFilters, totalResults } = useDataSelection()
  const { currentDatasetConfig } = useLegacyDataselectionConfig()

  const fetchMarkers = useCallback(
    async (signal: AbortSignal) => {
      if (!currentDatasetConfig) {
        return null
      }
      const markersShouldBeFetched =
        view === ViewMode.Split &&
        totalResults !== 0 &&
        totalResults <= currentDatasetConfig.MAX_NUMBER_OF_CLUSTERED_MARKERS &&
        (polygon?.polygon.length !== 0 || activeFilters)

      if (markersShouldBeFetched) {
        dispatch(fetchMarkersRequest())
        const mapMarkers = await currentDatasetConfig.CUSTOM_API.getMarkers(
          signal,
          currentDatasetConfig,
          createFiltersObject(activeFilters),
          mapZoom,
          mapBoundingBox ?? BOUNDING_BOX.COORDINATES,
        )
        dispatch(fetchMarkersSuccess(mapMarkers))
      }
    },
    [view, polygon, mapZoom, mapBoundingBox, activeFilters, totalResults, currentDatasetConfig],
  )

  return { fetchMarkers }
}

export default useFetchLegacyDataSelectionMarkers
