import { activeFiltersParam, queryParam, sortParam } from '../app/pages/SearchPage/query-params'
import {
  getActiveFilters,
  getQuery,
  getSort,
  REDUCER_KEY as SEARCH_REDUCER,
} from '../app/pages/SearchPage/SearchPageDucks'
import { routing } from '../app/routes'
import paramsRegistry from './params-registry'

const routesWithSearch = [
  routing.search.type,
  routing.dataSearch.type,
  routing.datasetSearch.type,
  routing.articleSearch.type,
  routing.specialSearch.type,
  routing.publicationSearch.type,
  routing.collectionSearch.type,
  routing.mapSearch.type,
]

/* istanbul ignore next */
export default paramsRegistry
  .addParameter(queryParam.name, (routes) => {
    routes.add(routesWithSearch, SEARCH_REDUCER, 'query', {
      selector: getQuery,
      defaultValue: '',
    })
  })
  .addParameter(sortParam.name, (routes) => {
    routes.add(routesWithSearch, SEARCH_REDUCER, 'sort', {
      selector: getSort,
      defaultValue: '',
    })
  })
  .addParameter(activeFiltersParam.name, (routes) => {
    routes.add(routesWithSearch, SEARCH_REDUCER, 'activeFilters', {
      selector: getActiveFilters,
      defaultValue: [],
      decode: (val) =>
        val
          ? val.split('|').map((encodedFilters) => {
              const [type, filters] = encodedFilters.split(';')
              const decodedFilters = filters.split('.')

              return {
                type,
                values: decodedFilters,
              }
            })
          : [],
      encode: (selectorResult = {}) =>
        selectorResult
          .map(({ type, values }) => {
            const encodedFilters = Array.isArray(values) ? values.join('.') : values
            return `${type};${encodedFilters}`
          })
          .join('|'),
    })
  })

export function decodeLocation(value) {
  if (!value) {
    return {}
  }

  const [lat, lng] = value.split(',')

  return {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  }
}

export function encodeLocation({ lat, lng }) {
  if (!lat || !lng) {
    return ''
  }

  return `${lat},${lng}`
}

export function decodeLayers(value) {
  if (!value) {
    return []
  }

  return value.split('|').map((entry) => {
    const [id, visibility] = entry.split(':')

    return {
      id,
      isVisible: visibility === '1',
    }
  })
}

export function encodeLayers(values) {
  if (!values || !values.length > 0) {
    return []
  }

  return values.map(({ id, isVisible }) => `${id}:${isVisible ? 1 : 0}`).join('|')
}

export function decodeBounds(values) {
  if (!values || !values.length) {
    return []
  }

  return values.split('|').map((value) =>
    value.split('-').map((entry) => {
      const [coordinates] = entry.split(':')
      const [lat, lng] = coordinates.split(',')

      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      }
    }),
  )
}

export function encodeBounds(values) {
  if (!values || !values.length > 0) {
    return []
  }

  return values
    .map((value) =>
      Array.isArray(value)
        ? value.map(({ lat, lng }) => `${lat},${lng}`).join('-') // seperates coordinates within one shape
        : `${value.lat},${value.lng}`,
    )
    .join('|') // seperates different shapes
}
