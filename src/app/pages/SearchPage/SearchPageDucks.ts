import paramsRegistry from '../../../store/params-registry'
import { typedAction } from '../../utils/typedAction'

export const REDUCER_KEY = 'search'
export const SET_SORT = 'search/SET_SORT'
export const SET_PAGE = 'search/SET_PAGE'
export const SET_FILTER_VALUES = 'search/SET_FILTER_VALUES'

export interface SearchPageState {
  activeFilters: ActiveFilter[]
  query: string
  sort: string | null
  page: number
}

export interface ActiveFilter {
  type: string
  values: string[]
}

export const setSort = (sort: string) => typedAction(SET_SORT, sort)
export const setPage = (page: number) => typedAction(SET_PAGE, page)

export const setFilterValues = (type: string, values: string[]) =>
  typedAction(SET_FILTER_VALUES, { type, values })

type SearchPageAction = ReturnType<typeof setSort | typeof setPage | typeof setFilterValues>

export const initialState: SearchPageState = {
  activeFilters: [],
  query: '',
  sort: null,
  page: 1,
}

export default function reducer(state = initialState, action: SearchPageAction): SearchPageState {
  const enrichedState: SearchPageState = {
    ...state,
    ...paramsRegistry.getStateFromQueries(REDUCER_KEY, action),
  }

  switch (action.type) {
    case SET_FILTER_VALUES: {
      const { type, values } = action.payload
      const existingFilter = enrichedState.activeFilters.find((filter) => filter.type === type)
      const updatedFilter: ActiveFilter =
        existingFilter !== undefined ? { ...existingFilter, values } : { type, values }

      // Append or replace the updated filter.
      let activeFilters =
        existingFilter !== undefined
          ? enrichedState.activeFilters.map((filter) =>
              filter.type === type ? updatedFilter : filter,
            )
          : [...enrichedState.activeFilters, updatedFilter]

      // Remove any filter that are empty.
      activeFilters = activeFilters.filter((filter) => filter.values.length !== 0)

      // Sort the filters so URL will remain consistent.
      activeFilters = activeFilters
        .sort((a, b) => (a.type > b.type ? 1 : -1))
        .map((filter) => ({ ...filter, values: filter.values.sort() }))

      return {
        ...enrichedState,
        activeFilters,
      }
    }

    case SET_SORT: {
      const sort = action.payload.length > 0 ? action.payload : null

      return {
        ...enrichedState,
        sort,
      }
    }

    case SET_PAGE: {
      const page = action.payload > 0 ? action.payload : initialState.page

      return {
        ...enrichedState,
        page,
      }
    }

    default:
      return enrichedState
  }
}

type StoreValue = { [REDUCER_KEY]: SearchPageState }

export const getSort = ({ [REDUCER_KEY]: { sort } }: StoreValue) => sort
export const getPage = ({ [REDUCER_KEY]: { page } }: StoreValue) => page

export const getQuery = ({ [REDUCER_KEY]: { query } }: StoreValue) => query
export const getActiveFilters = ({ [REDUCER_KEY]: { activeFilters } }: StoreValue) => activeFilters

export const getFilterValues = (type: string) => ({
  [REDUCER_KEY]: { activeFilters },
}: StoreValue) => {
  const matchedFilter = activeFilters.find((filter) => filter.type === type)

  if (matchedFilter !== undefined) {
    return matchedFilter.values
  }

  return []
}
