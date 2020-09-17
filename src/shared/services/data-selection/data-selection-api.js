import { identity } from 'lodash'
import isDefined from '../is-defined'
import isObject from '../is-object'
import DATA_SELECTION_CONFIG from './data-selection-config'

function formatFilters(dataset, rawData) {
  const formattedFilters = DATA_SELECTION_CONFIG.datasets[dataset].FILTERS
  const sortFilters = DATA_SELECTION_CONFIG.datasets[dataset].SORT_FILTERS || false
  const newRawData = { ...rawData }
  const filters = formattedFilters
    .filter((filter) => isObject(rawData[filter.slug]))
    .map((filter) => {
      const newFilter = { ...filter }
      // use the specific term order when defined
      if (newFilter.order) {
        newRawData[newFilter.slug].options = newFilter.order
          .map((term) => {
            const found = newRawData[newFilter.slug].options.filter((item) => item.label === term)
            return found.length > 0 ? found[0] : null
          })
          .filter((item) => !!item)
        delete newFilter.order
      }
      return { ...newFilter, ...newRawData[newFilter.slug] }
    })

  if (sortFilters) {
    return filters.map((filter) => {
      filter.options.sort((a, b) => {
        // ignore upper and lowercase
        const labelA = a.label.toLowerCase()
        const labelB = b.label.toLowerCase()
        if (labelA < labelB) {
          return -1
        }
        if (labelA > labelB) {
          return 1
        }

        // names must be equal
        return 0
      })
      return filter
    })
  }

  return filters
}

function recurGetContent(path, rawData) {
  if (path.length === 1) {
    const key = path[0]
    const rawValue = rawData[key]

    return Array.isArray(rawValue) ? rawValue.filter(identity).join(' | ') : rawValue
  }
  const key = path[0]
  const rawValue = rawData[key]
  const remainingPath = path.splice(1)

  return Array.isArray(rawValue)
    ? rawValue.map((value) => recurGetContent(remainingPath, value))
    : recurGetContent(remainingPath, rawValue)
}

function formatData(dataset, view, rawData) {
  // Filter on fields allowed by current authorization level
  const fields = DATA_SELECTION_CONFIG.datasets[dataset].CONTENT[view]

  // For the catalog or when there is no format definition return the data unformatted.
  // The formatting is complex an will be done in the catalog view component
  if (!fields || view === 'CATALOG') {
    return rawData
  }
  return {
    head: fields.map((item) => item.label),
    body: rawData.map((rawDataRow) => ({
      detailEndpoint: rawDataRow._links.self.href,
      content: fields.map((item) =>
        item.variables.map((variable) => ({
          key: variable,
          value: recurGetContent(variable.split('.'), rawDataRow),
        })),
      ),
    })),
    formatters: fields.map((item) => item.formatter),
    templates: fields.map((item) => item.template),
  }
}

function filterUnavailableFilters(dataset, activeFilters = {}) {
  // Filter out the filters that are not used in the current dataset
  // Filtering is done based on the configured possible filters.
  const activeAndAvailableFilters = { ...activeFilters }

  // Filter activeFilters that are not available for this dataset
  Object.keys(activeFilters).forEach((activeFilterKey) => {
    const isAvailable =
      DATA_SELECTION_CONFIG.datasets[dataset].FILTERS.filter(
        (filter) => activeFilterKey === filter.slug,
      ).length === 1

    if (!isAvailable && !isDefined(activeFilters.shape)) {
      delete activeAndAvailableFilters[activeFilterKey]
    }
  })

  return {
    ...activeAndAvailableFilters,
  }
}

function getMarkers(dataset, activeFilters, zoomLevel, boundingBox) {
  const config = DATA_SELECTION_CONFIG.datasets[dataset]
  const apiService = config.CUSTOM_API
  const filteredFilters = filterUnavailableFilters(dataset, activeFilters)

  return apiService.getMarkers(config, filteredFilters, zoomLevel, boundingBox)
}

function query(dataset, view, activeFilters, page, searchText, shape, catalogFilters) {
  const customApi = DATA_SELECTION_CONFIG.datasets[dataset].CUSTOM_API

  return customApi
    .query(
      DATA_SELECTION_CONFIG.datasets[dataset],
      view,
      filterUnavailableFilters(dataset, activeFilters),
      page,
      searchText,
      shape,
      catalogFilters,
    )
    .then((data) => ({
      numberOfPages: data.numberOfPages,
      numberOfRecords: data.numberOfRecords,
      filters: formatFilters(dataset, data.filters),
      data: formatData(dataset, view, data.data),
    }))
}

export { query, getMarkers }
