import { fetchWithToken } from '../api/api'
import environment from '../../../environment'
import { createFiltersObject, formatData, formatFilters } from './normalizations'
import { LegacyDataSelectionConfigType } from './data-selection-config'
import {
  ActiveFilter,
  LegacyDataSelectionViewTypes,
} from '../../../app/components/DataSelection/types'

function getFromQuery(
  signal: AbortSignal,
  config: LegacyDataSelectionConfigType,
  view: LegacyDataSelectionViewTypes,
  activeFilters: ActiveFilter[],
  page: number,
) {
  let searchPage = page

  // Making sure to not request pages higher then max allowed.
  // If that is the case requesting for page 1, to obtain filters.
  // In the response the data will be dumped.
  searchPage = config.MAX_AVAILABLE_PAGES && page > config.MAX_AVAILABLE_PAGES ? 1 : page

  const searchParams = {
    page: searchPage.toString(),
    dataset: 'ves',
    ...createFiltersObject(activeFilters),
  }

  const uri: string = config.ENDPOINT_PREVIEW[view] ?? config.ENDPOINT_PREVIEW
  return fetchWithToken(`${environment.API_ROOT}${uri}`, searchParams, signal).then((data) => {
    const newData = { ...data }
    if (searchPage !== page) {
      // Requested page was out of api reach, dumping data
      // and saving only the filters
      newData.object_list = []
    }

    return {
      numberOfPages: newData.page_count,
      numberOfRecords: newData.object_count,
      availableFilters: formatFilters(config, newData.aggs_list),
      data: formatData(config, view, newData.object_list),
    }
  })
}

export default getFromQuery
