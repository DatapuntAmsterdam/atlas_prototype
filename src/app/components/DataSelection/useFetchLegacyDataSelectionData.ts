import { useSelector } from 'react-redux'
import { useMemo } from 'react'
import { matchPath, useLocation } from 'react-router-dom'
import { getUser, getUserScopes } from '../../../shared/ducks/user/user'
import AuthScope from '../../../shared/services/api/authScope'
import { AuthError } from '../../../shared/services/api/customError'
import getFromQuery from '../../../shared/services/data-selection/getFromQuery'
import { ViewMode, viewParam } from '../../pages/MapPage/query-params'
import formatCount from '../../utils/formatCount'
import useParam from '../../utils/useParam'
import { useDataSelection } from './DataSelectionContext'
import { DatasetType, LegacyDataSelectionViewTypes } from './types'
import useLegacyDataselectionConfig from './useLegacyDataselectionConfig'
import { pageParam } from '../../pages/SearchPage/query-params'
import PAGES from '../../pages'
import { routing } from '../../routes'

const DEFAULT_ERROR_MESSAGE = 'Er is een fout opgetreden, probeer het later nog eens.'

const VIEWS_TO_PARAMS = {
  [ViewMode.Split]: LegacyDataSelectionViewTypes.List,
  [ViewMode.Map]: LegacyDataSelectionViewTypes.List,
  [ViewMode.Full]: LegacyDataSelectionViewTypes.Table,
}

/**
 * Note: a lot of this logic has been refactored from several sagas and put into this one
 * hook. There is legacy code mixed with modern stuff, so we do need to get rid of this
 * hook ASAP.
 */
const useFetchLegacyDataSelectionData = () => {
  const [view] = useParam(viewParam)
  const location = useLocation()
  const currentPage = useMemo(
    () =>
      Object.values(routing).find((value) =>
        matchPath(location.pathname, { path: value.path, exact: true }),
      )?.page,
    [location, routing],
  )
  const user = useSelector(getUser)
  const userHasAccessToPage =
    currentPage === PAGES.ADDRESSES ||
    (currentPage === PAGES.ESTABLISHMENTS && user.authenticated) ||
    (currentPage === PAGES.CADASTRAL_OBJECTS && user.scopes.includes('BRK/RSN'))

  const [page] = useParam(pageParam)
  const userScopes = useSelector(getUserScopes)
  const { setTotalResults, setAvailableFilters, activeFilters } = useDataSelection()
  const { currentDatasetConfig, currentDatasetType } = useLegacyDataselectionConfig()

  const fetchData = async (signal: AbortSignal) => {
    // Side effect to reset the number of results and remove the markers from the map
    setTotalResults(0)

    if (!currentDatasetConfig) {
      throw new Error(DEFAULT_ERROR_MESSAGE)
    }
    const datasetScope = currentDatasetConfig.AUTH_SCOPE
    const authScopeError = datasetScope ? !userScopes.includes(datasetScope) : false
    if (!userHasAccessToPage || authScopeError) {
      throw new AuthError(
        401,
        datasetScope === AuthScope.BrkRsn
          ? `Medewerkers met speciale bevoegdheden kunnen inloggen om kadastrale objecten met
            zakelijk rechthebbenden te bekijken.`
          : `Medewerkers/ketenpartners van Gemeente Amsterdam kunnen inloggen om maatschappelijke activiteiten en vestigingen te bekijken. `,
      )
    }

    try {
      const result = await getFromQuery(
        signal,
        currentDatasetConfig,
        VIEWS_TO_PARAMS[view],
        activeFilters,
        page,
      )

      setAvailableFilters(result.availableFilters)
      setTotalResults(result.numberOfRecords)

      const { MAX_AVAILABLE_PAGES, MAX_NUMBER_OF_CLUSTERED_MARKERS } = currentDatasetConfig

      const messageMaxPages =
        MAX_AVAILABLE_PAGES && page > MAX_AVAILABLE_PAGES
          ? `Alleen de eerste ${MAX_AVAILABLE_PAGES ?? ''} pagina's kunnen worden weergegeven
                        (om technische redenen). Bij downloaden worden wel alle resultaten
                        opgenomen.`
          : null
      const messageClusteredMarkers =
        view === ViewMode.Split &&
        MAX_NUMBER_OF_CLUSTERED_MARKERS &&
        result.numberOfRecords > MAX_NUMBER_OF_CLUSTERED_MARKERS
          ? `Deze resultaten worden niet getoond op de kaart, omdat deze niet meer dan ${formatCount(
              MAX_NUMBER_OF_CLUSTERED_MARKERS ?? 0,
            )} resultaten tegelijk kan weergeven (om technische redenen).`
          : null

      const showSbiFilers = currentDatasetType === DatasetType.Hr

      return { ...result, messageMaxPages, messageClusteredMarkers, showSbiFilers }
    } catch (e) {
      throw new Error(DEFAULT_ERROR_MESSAGE)
    }
  }

  return {
    fetchData,
  }
}

export default useFetchLegacyDataSelectionData
